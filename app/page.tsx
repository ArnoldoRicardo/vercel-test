import { GraphQLClient, gql } from 'graphql-request'
import { getCurrentUser } from 'utils/todoGraphqlClient'
import Link from 'next/link'

export default async function Page() {
  // const user = await getCurrentUser()
  return (
    <>
      users:
      <ul>
        {/* {users && users.map((user) => <li key={user.id}>{user.username}</li>)} */}
      </ul>
      <ul>
        <li>
          experimental
          <Link href="/book/0">primer book</Link>
        </li>
        <li>
          legacy
          <Link href="/todos/0">primer book</Link>
        </li>
      </ul>
    </>
  )
}
