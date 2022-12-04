'use client'

import { v4 } from 'uuid'
import { useState } from 'react'
import Header from './header'
import MainSection from './main-section'
import 'todomvc-app-css/index.css'
import { Todo, TodoUpdate } from '../src/todo'

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([])

  // Define event handlers and connect them to Replicache mutators. Each
  // of these mutators runs immediately (optimistically) locally, then runs
  // again on the server-side automatically.
  const handleNewItem = (text: string) =>
    setTodos([...todos, { id: v4(), text, completed: false, sort: 1 }])

  const handleUpdateTodo = (update: TodoUpdate) => {
    console.log(update)
    const newTodos = todos.map((todo) => {
      if (todo.id === update.id) {
        return {
          id: todo.id,
          text: update.text || todo.text,
          completed: !!update.completed,
          sort: update.sort || todo.sort
        }
      }
      return todo
    })
    console.log('update', newTodos)
    setTodos([...newTodos])
  }

  const handleDeleteTodos = (ids: string[]) => {
    console.log(ids)
    const newTodos = todos
      .map((todo) => {
        if (!ids.includes(todo.id)) return todo
      })
      .filter(Boolean)
    setTodos(newTodos as Todo[])
  }

  const handleCompleteTodos = (completed: boolean, ids: string[]) => {
    const newTodos = todos.map((todo) => {
      if (todo.id in ids)
        return {
          ...todo,
          completed: !todo.completed
        }
      return todo
    })
    setTodos([...newTodos])
  }

  return (
    <>
      <h1>Hello, Next.js!</h1>
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
