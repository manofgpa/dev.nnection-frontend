import axios, { AxiosError } from 'axios'
import { parseCookies, setCookie } from 'nookies'
import { singOut } from '../contexts/AuthContext'

type User = {
  token: string
  refreshToken: string
}

let cookies = parseCookies()
let isRefreshing = false
let failedRequestsQueue = []

export const api = axios.create({
  baseURL: 'http://localhost:3001/',
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
        cookies = parseCookies()

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

              setCookie(undefined, 'devnnection.token', token, {
                maxAge: 60 * 60 * 24 * 30, // 30 days
                path: '/',
              })

              setCookie(
                undefined,
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
        singOut()
      }
    }

    return Promise.reject(error)
  }
)