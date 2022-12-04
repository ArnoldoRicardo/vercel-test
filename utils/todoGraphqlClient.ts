import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient(
  process.env.VERCEL_URL || 'http://localhost:3000/api/graphql'
)

const GET_ALL_TODO_QUERY = gql`
  query getAllTodo {
    getAllTodo {
      id
      text
      completed
      sort
    }
  }
`

export const getTodos = async () => {
  const response = await client.request(GET_ALL_TODO_QUERY)
  if (response.getAllTodo) {
    return response.getAllTodo
  }
}

const GET_CURRENT_USER_QUERY = gql`
  query getCurrentUser {
    me {
      id
      username
    }
  }
`

export const getCurrentUser = async () => {
  const response = await client.request(GET_CURRENT_USER_QUERY)
  if (response.getCurrentUser) {
    return response.getCurrentUser
  }
}

const ADD_TODO_QUERY = gql`
  mutation createTodo($text: String!) {
    createTodo(text: $text) {
      id
      text
      completed
      sort
    }
  }
`

export const addNewTodo = async (text: string) => {
  const response = await client.request(ADD_TODO_QUERY, { text })
  if (response.createTodo) {
    return response.createTodo
  }
}

const UPDATE_TODO_QUERY = gql`
  mutation updateTodo(
    $id: String!
    $text: String
    $sort: Int
    $completed: Boolean
  ) {
    updateTodo(id: $id, text: $text, sort: $sort, completed: $completed) {
      completed
      id
      sort
      text
    }
  }
`

export const updateTodo = async (update: TodoUpdate) => {
  const response = await client.request(UPDATE_TODO_QUERY, update)
  if (response.updateTodo) {
    return response.updateTodo
  }
}

const DELETE_TODO_QUERY = gql`
  mutation deleteTodos($ids: [String]!) {
    deleteTodos(ids: $ids)
  }
`
export const deleteTodos = async (ids: string[]) => {
  const response = await client.request(DELETE_TODO_QUERY, { ids })
  if (response.deleteTodos) {
    return response.deleteTodos
  }
}

const COMPLETED_TODO_QUERY = gql`
  mutation completedTodos($ids: [String]!) {
    completedTodos(ids: $ids)
  }
`
export const completedTodos = async (ids: string[]) => {
  const response = await client.request(COMPLETED_TODO_QUERY, { ids })
  if (response.completedTodos) {
    return response.completedTodos
  }
}
