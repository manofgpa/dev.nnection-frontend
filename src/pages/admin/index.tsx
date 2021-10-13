import {
  Box,
  Flex,
  Heading,
  Button,
  Icon,
  Table,
  Thead,
  Tr,
  Th,
  Checkbox,
  Tbody,
  Td,
  Text,
  useBreakpointValue,
  Spinner,
  Link,
} from '@chakra-ui/react'
import { RiAddLine, RiPencilLine } from 'react-icons/ri'
import { Header } from '../../components/Header'
import { Pagination } from '../../components/Pagination'
import { Sidebar } from '../../components/Sidebar'
import NextLink from 'next/link'
import { useUsers } from '../../hooks/users/useUsers'
import { useState } from 'react'
import { queryClient } from '../../services/queryClient'
import { api } from '../../services/api'

export default function Admin() {
  const [page, setPage] = useState(1)

  const { data, isLoading, error, isFetching } = useUsers(page)

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true,
  })

  const handlePrefetchUser = async (userId: string) => {
    await queryClient.prefetchQuery(
      ['user', userId],
      async () => {
        const response = await api.get(`users/${userId}`)

        return response.data
      },
      {
        staleTime: 1000 * 60 * 10, // 10 minutos
      }
    )
  }

  return (
    <Flex direction='column' h='130vh' bg='gray.900'>
      <Header />
      <Flex
        w={['auto', '100%']}
        my='6'
        maxWidth={1480}
        mx='auto'
        px='6'
        color='gray.50'>
        <Sidebar />
        <Box
          flex='1'
          borderRadius={8}
          p='8'
          h={['122vh', '0vh']}
          mt={['10', '10', '20']}
          ml={['0', '0', '0', '60']}>
          <Flex mb='8' justify='space-between' align='center'>
            <Heading size='lg' fontWeight='normal'>
              Users
              {!isLoading && isFetching && (
                <Spinner size='sm' color='gray.500' ml='4' />
              )}
            </Heading>
            <NextLink href='/admin/createUser'>
              <Button
                as='a'
                size='md'
                fontSize='md'
                colorScheme='green'
                leftIcon={
                  <Icon as={RiAddLine} fontSize='xl' cursor='pointer' />
                }>
                Create user
              </Button>
            </NextLink>
          </Flex>
          {isLoading ? (
            <Flex justify='center'>
              <Spinner />
            </Flex>
          ) : error ? (
            <Flex justify='center'>
              <Text>Fail to fetch data.</Text>
            </Flex>
          ) : (
            <>
              <Table colorScheme='blackAlpha'>
                <Thead>
                  <Tr>
                    <Th px={['4', '4', '6']} color='gray.300' width='8'>
                      <Checkbox colorScheme='green' />
                    </Th>
                    <Th>User</Th>
                    <Th>Registration date </Th>
                    <Th w='8'></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {data?.users?.map(user => (
                    <Tr key={user.id}>
                      <Td px={['4', '4', '6']}>
                        <Checkbox colorScheme='green' />
                      </Td>
                      <Td>
                        <Box>
                          <Link
                            color='green.400'
                            onMouseEnter={() => handlePrefetchUser(user.id)}>
                            <Text fontWeight='bold'>{user.name}</Text>
                          </Link>
                          <Text fontSize='small' color='gray.300'>
                            {user.email}
                          </Text>
                        </Box>
                      </Td>
                      {isWideVersion && <Td>{user.createdAt}</Td>}
                      <Td>
                        <Button
                          as='a'
                          size='md'
                          fontSize='md'
                          colorScheme='orange'
                          cursor='pointer'
                          leftIcon={<Icon as={RiPencilLine} />}>
                          Edit
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Pagination
                totalRegisterCount={data?.totalUsers}
                currentPage={page}
                onPageChange={setPage}
              />
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  )
}
