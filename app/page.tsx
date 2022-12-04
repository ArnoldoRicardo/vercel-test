import { getAllUser } from '../utils/userService'

export default async function Page() {
  const users = await getAllUser()
  return (
    <>
      users:
      <ul>
        {users && users.map((user) => <li key={user.id}>{user.username}</li>)}
      </ul>
    </>
  )
}
