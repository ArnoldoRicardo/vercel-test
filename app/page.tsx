import { GraphQLClient, gql } from 'graphql-request'
import { getCurrentUser } from 'utils/todoGraphqlClient'
import Link from 'next/link'

export default async function Page() {
  // const user = await getCurrentUser()
  return (
    <>
      user:
      <ul>
        {/* {users && users.map((user) => <li key={user.id}>{user.username}</li>)} */}
      </ul>
      list of some apps
      <ul>
        <li>
          <Link href="/todos/0"> Todo app</Link>
        </li>
      </ul>
      experimental
      <Link href="/book/0">primer book</Link>
    </>
  )
}
