import { Box, Flex, Avatar, Stack, HStack, Text, Link } from '@chakra-ui/react'
import { Post as PostComponent } from '../Post'
import { InputPostBox } from './InputPostBox'
import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { timeSince } from '../../utils/timeSince'
import ContentLoader from 'react-content-loader'
import { AuthContext } from '../../contexts/AuthContext'

type User = {
  first_name: string
  last_name: string
  email: string
  image: string
}

type Post = {
  message: string
  user: User
  timestamp: Date
  likes: {
    count: number
    users: User[]
  }
  github: string
  linkedin: string
  image: string
  tags: string[]
}

export const Feed = () => {
  const urlAPI = 'https://devnnection.herokuapp.com/posts'
  const { user } = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(3000)
  const [posts, setPosts] = useState<Post[]>([
    {
      message: '',
      user: {
        first_name: '',
        email: '',
        last_name: '',
        image: '',
      },
      timestamp: new Date(),
      likes: {
        count: 0,
        users: [],
      },
      github: '',
      linkedin: '',
      image: '',
      tags: [],
    },
  ])

  const fetchData = () => {
    axios
      .get<{ posts: Post[] }>(urlAPI)
      .then(response => {
        const sortedPosts = [...response.data.posts]

        setPosts(
          sortedPosts.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
        )

        setIsLoading(false)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval])

  return (
    <Flex direction='column' mx='auto' p={['0', '0', '4']} w='100%'>
      <Flex bg='gray.200' p='4' borderRadius={10} direction='column'>
        <Flex>
          <Avatar
            size='2xl'
            name={`${user?.first_name} ${user?.last_name}`}
            // TODO: Dynamic picture
            src={user?.image}
            alignSelf='center'
            mr='4'
          />
          <Box as='label' w='100%'>
            <InputPostBox username={`${user?.first_name} ${user?.last_name}`} />
          </Box>
        </Flex>
      </Flex>
      <Flex>
        <HStack spacing='6' mt='6' fontSize='20' fontWeight='bold'>
          <Link>
            <Text>Feed</Text>
          </Link>
          <Link>
            <Text>Latest</Text>
          </Link>
          <Link>
            <Text>Top</Text>
          </Link>
        </HStack>
      </Flex>
      <Stack spacing='4' mt='5'>
        {isLoading ? (
          <>
            <ContentLoader
              speed={2}
              width={800}
              height={400}
              viewBox='0 0 476 124'
              backgroundColor='#ccc'
              foregroundColor='#227c38'>
              <rect x='48' y='8' rx='3' ry='3' width='88' height='6' />
              <rect x='48' y='26' rx='3' ry='3' width='52' height='6' />
              <rect x='0' y='56' rx='3' ry='3' width='410' height='6' />
              <rect x='0' y='72' rx='3' ry='3' width='380' height='6' />
              <rect x='0' y='88' rx='3' ry='3' width='178' height='6' />
              <circle cx='20' cy='20' r='20' />
            </ContentLoader>
            <ContentLoader
              speed={2}
              width={800}
              height={400}
              viewBox='0 0 476 124'
              backgroundColor='#ccc'
              foregroundColor='#227c38'>
              <rect x='48' y='8' rx='3' ry='3' width='88' height='6' />
              <rect x='48' y='26' rx='3' ry='3' width='52' height='6' />
              <rect x='0' y='56' rx='3' ry='3' width='410' height='6' />
              <rect x='0' y='72' rx='3' ry='3' width='380' height='6' />
              <rect x='0' y='88' rx='3' ry='3' width='178' height='6' />
              <circle cx='20' cy='20' r='20' />
            </ContentLoader>
            <ContentLoader
              speed={2}
              width={800}
              height={400}
              viewBox='0 0 476 124'
              backgroundColor='#ccc'
              foregroundColor='#227c38'>
              <rect x='48' y='8' rx='3' ry='3' width='88' height='6' />
              <rect x='48' y='26' rx='3' ry='3' width='52' height='6' />
              <rect x='0' y='56' rx='3' ry='3' width='410' height='6' />
              <rect x='0' y='72' rx='3' ry='3' width='380' height='6' />
              <rect x='0' y='88' rx='3' ry='3' width='178' height='6' />
              <circle cx='20' cy='20' r='20' />
            </ContentLoader>
          </>
        ) : (
          posts.map(post => (
            <PostComponent
              key={post['_id']}
              avatar={post.user?.image}
              image={post['image']}
              message={post['message']}
              userName={`${post.user?.first_name} ${post.user?.last_name}`}
              timestamp={timeSince(post['timestamp'])}
              likes={post['likes']['count']}
              // comments={post['likes']['users'].length}
              tags={post['tags']}
            />
          ))
        )}
      </Stack>
    </Flex>
  )
}
