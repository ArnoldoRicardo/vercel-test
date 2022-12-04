export type Todo = {
  id: string
  text: string
  completed: boolean
  sort: number
}

export type TodoUpdate = Partial<Todo> & Pick<Todo, 'id'>
