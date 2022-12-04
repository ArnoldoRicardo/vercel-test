'use client'

import { v4 } from 'uuid'
import { useState } from 'react'
import { GraphQLClient, gql } from 'graphql-request'
import Header from './header'
import MainSection from './main-section'
import 'todomvc-app-css/index.css'

const client = new GraphQLClient('http://localhost:3000/api/graphql')

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

const UPDATE_TODO_QUERY = gql`
  mutation MyMutation(
    $id: String!
    $text: String!
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

const DELETE_TODO_QUERY = gql`
  mutation MyMutation($ids: String) {
    deleteTodos(ids: $ids)
  }
`

const COMPLETED_TODO_QUERY = gql`
  mutation MyMutation($ids: String) {
    completedTodos(ids: $ids)
  }
`

type Args = { RawTodos?: Todo[] }

export default function Page({ RawTodos }: Args) {
  const [todos, setTodos] = useState<Todo[]>(RawTodos || [])

  const handleNewItem = async (text: string) => {
    const response = await client.request(ADD_TODO_QUERY, { text })
    setTodos([...todos, { ...response?.createTodo }])
  }

  const handleUpdateTodo = async (update: TodoUpdate) => {
    const response = await client.request(UPDATE_TODO_QUERY, update)
    setTodos((current) =>
      current.map((todo) => {
        if (todo.id == update.id) {
          return {
            id: todo.id,
            text: update.text || todo.text,
            sort: update.sort || todo.sort,
            completed: update.completed || todo.completed
          }
        }
        return todo
      })
    )
  }

  const handleDeleteTodos = async (ids: string[]) => {
    const response = await client.request(DELETE_TODO_QUERY, ids)
    setTodos((current) =>
      current.filter((todo) => {
        if (!ids.includes(todo.id)) return todo
      })
    )
  }

  const handleCompleteTodos = async (completed: boolean, ids: string[]) => {
    const response = await client.request(COMPLETED_TODO_QUERY, ids)
    setTodos((current) =>
      current.map((todo) => {
        if (todo.id in ids)
          return {
            ...todo,
            completed: !todo.completed
          }
        return todo
      })
    )
  }

  return (
    <>
      <Header onNewItem={handleNewItem} />
      <MainSection
        todos={todos}
        onUpdateTodo={handleUpdateTodo}
        onDeleteTodos={handleDeleteTodos}
        onCompleteTodos={handleCompleteTodos}
      />
    </>
  )
}
