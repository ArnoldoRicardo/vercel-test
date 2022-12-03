interface User {
  id: number
  username: string
  password?: string
  hasshed_password?: string
}

type userInDb = Required<Omit<User, 'password'>>

type userArgs = Required<Pick<User, 'username' | 'password'>>

interface Context {
  currentUser: userInDb
}
