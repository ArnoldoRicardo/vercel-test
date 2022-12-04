import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createYoga, createSchema } from 'graphql-yoga'
import gql from 'graphql-tag'
import { GraphQLError } from 'graphql'
import { v4 } from 'uuid'

import { findUser, newUser } from 'utils/userService'
import {
  addTodo,
  updateTodo,
  deleteTodos,
  completeTodos,
  getAllTodos
} from 'utils/todoService'

const typeDefs = gql`
  type Todo {
    id: String
    text: String
    completed: Boolean
    sort: Int
  }

  type User {
    id: ID!
    username: String!
  }

  type Token {
    value: String!
  }

  type Query {
    me: User
    getAllTodo: [Todo]
  }
  type Mutation {
    login(username: String!, password: String!): Token
    createUser(username: String!, password: String!): User
    createTodo(text: String!): Todo
    updateTodo(id: String!, text: String, completed: Boolean, sort: Int): Todo
    deleteTodos(ids: [String]!): String
    completedTodos(ids: [String]!): String
  }
`

const resolvers = {
  Query: {
    me: async (root: undefined, args: undefined, { currentUser }: Context) => {
      if (!currentUser) throw new GraphQLError('query dont allowed')
      return currentUser
    },
    getAllTodo: async () => {
      return await getAllTodos('0')
    }
  },
  Mutation: {
    login: async (root: undefined, { username, password }: userArgs) => {
      const user = await findUser(username)
      if (!user) throw new GraphQLError('wrong credentials.')
      const hasshed_password = user.hasshed_password
      if (!(await bcrypt.compare(password, hasshed_password))) {
        throw new GraphQLError('wrong credentials')
      }
      const jwt_secret = process.env.JWT_SECRET
        ? process.env.JWT_SECRET
        : 'default'
      return {
        value: jwt.sign(user, jwt_secret)
      }
    },
    createUser: async (root: undefined, { username, password }: userArgs) => {
      const hasshed_password = await bcrypt.hash(password, 10)
      return await newUser(username, hasshed_password)
    },
    createTodo: async (root: undefined, { text }: { text: string }) => {
      const id = v4()
      return await addTodo(text, id)
    },
    updateTodo: async (root: undefined, update: TodoUpdate) => {
      return await updateTodo(update)
    },
    deleteTodos: async (root: undefined, { ids }: { ids: string[] }) => {
      return await deleteTodos(ids)
    },
    completedTodos: async (root: undefined, { ids }: { ids: string[] }) => {
      return await completeTodos(ids)
    }
  }
}

const schema = createSchema({
  typeDefs,
  resolvers
})

export default createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  context: async ({ request }) => {
    const auth = request ? request.headers.get('authorization') : null
    if (auth && auth.toLocaleLowerCase().startsWith('bearer ')) {
      const token = auth.substring(7)
      const jwt_secret = process.env.JWT_SECRET
        ? process.env.JWT_SECRET
        : 'default'
      const decodedToken: User = jwt.verify(token, jwt_secret) as User
      const currentUser = await findUser(decodedToken.username)
      return { currentUser }
    }
  }
})
