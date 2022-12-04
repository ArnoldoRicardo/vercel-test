'use client'

import { v4 } from 'uuid'
import { useState } from 'react'
import { GraphQLClient, gql } from 'graphql-request'
//TODO: pensar si moverlos por que son de control
import Header from 'components/header'
import MainSection from 'components/main-section'
import 'todomvc-app-css/index.css'
import {
  addNewTodo,
  updateTodo,
  deleteTodos,
  completedTodos
} from 'utils/todoGraphqlClient'

type Args = { rawTodos?: Todo[] }

export default function Page({ rawTodos }: Args) {
  const [todos, setTodos] = useState<Todo[]>(rawTodos || [])

  const handleNewItem = async (text: string) => {
    const newTodo = await addNewTodo(text)
    setTodos([...todos, newTodo])
  }

  const handleUpdateTodo = async (update: TodoUpdate) => {
    const response = await updateTodo(update)
    setTodos((current) =>
      current.map((todo) => {
        if (todo.id == update.id) {
          return {
            id: todo.id,
            text: update.text || todo.text,
            sort: update.sort || todo.sort,
            completed:
              typeof update.completed === 'boolean'
                ? update.completed
                : todo.completed
          }
        }
        return todo
      })
    )
  }

  const handleDeleteTodos = async (ids: string[]) => {
    const response = await deleteTodos(ids)
    setTodos((current) =>
      current.filter((todo) => {
        if (!ids.includes(todo.id)) return todo
      })
    )
  }

  const handleCompleteTodos = async (completed: boolean, ids: string[]) => {
    const response = await completedTodos(ids)
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
