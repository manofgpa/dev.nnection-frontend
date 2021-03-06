import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { signOut } from '../contexts/AuthContext'
import { AuthTokenError } from './errors/AuthTokenError'

type User = {
  token: string
  refreshToken: string
}

let isRefreshing = false
let failedRequestsQueue = []

export const setupAPIClient = (ctx = undefined) => {
  let cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: 'https://devnnection.herokuapp.com/',
    headers: {
      Authorization: `Bearer ${cookies['devnnection.token']}`,
    },
  })

  api.interceptors.response.use(
    response => {
      return response
    },
    (error: AxiosError) => {
      if (error.response.status === 401) {
        if (error.response.data?.code === 'token.expired') {
          cookies = parseCookies(ctx)

          const { 'devnnection.refreshToken': refreshToken } = cookies
          const originalConfig = error.config

          if (!isRefreshing) {
            isRefreshing = true

            api
              .post<User>('/refresh', {
                refreshToken,
              })
              .then(response => {
                const { token } = response.data

                setCookie(ctx, 'devnnection.token', token, {
                  maxAge: 60 * 60 * 24 * 30, // 30 days
                  path: '/',
                })

                setCookie(
                  ctx,
                  'devnnection.refreshToken',
                  response.data.refreshToken,
                  {
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: '/',
                  }
                )

                api.defaults.headers['Authorization'] = `Bearer ${token}`

                failedRequestsQueue.forEach(request => request.onSuccess(token))
                failedRequestsQueue = []
              })
              .catch(err => {
                failedRequestsQueue.forEach(request => request.onFailure(err))
                failedRequestsQueue = []

                if (process.browser) {
                  signOut()
                } else {
                  return Promise.reject(new AuthTokenError())
                }
              })
              .finally(() => {
                isRefreshing = false
              })
          }

          return new Promise((resolve, reject) => {
            failedRequestsQueue.push({
              onSuccess: (token: string) => {
                originalConfig.headers['Authorization'] = `Bearer ${token}`

                resolve(api(originalConfig))
              },
              onFailure: (err: AxiosError) => {
                reject(err)
              },
            })
          })
        } else {
          if (process.browser) {
            signOut()
          } else {
            return Promise.reject(new AuthTokenError())
          }
        }
      }

      return Promise.reject(error)
    }
  )

  return api
}
