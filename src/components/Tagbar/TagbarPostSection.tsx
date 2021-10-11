import { Box, Divider, Link, Stack, Text } from '@chakra-ui/react'
import { TagbarPost } from './TagbarPost'

type Post = {
  title: string
  author: string
}

type Section = {
  title: string
  posts: Post[]
}

interface TagbarPostSectionProps {
  sections: Section[]
}

export const TagbarPostSection = ({ sections }: TagbarPostSectionProps) => {
  return (
    <>
      {sections.map(section => (
        <Box w='90%' bg='#FFFFFF' mt='5' borderRadius={10} key={section.title}>
          <Stack spacing='4' mt='4' align='stretch' fontSize='20'>
            <Box p='2'>
              <Link>
                <Text fontWeight='medium'>#{section.title}</Text>
              </Link>
            </Box>
            <Divider />
            {/* TODO Key prop */}
            {section.posts.map(post => (
              <>
                <TagbarPost title={post.title} author={post.author} />
                <Divider />
              </>
            ))}
          </Stack>
        </Box>
      ))}
    </>
  )
}
