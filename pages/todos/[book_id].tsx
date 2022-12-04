import App from 'src/app'
import { getAllTodos } from 'utils/todoService'

type PageProps = {
  todos?: Todo[]
}

export default function Books({ todos }: PageProps) {
  return (
    <section className="todoapp">
      <App rawTodos={todos} />
    </section>
  )
}

type Args = {
  params: { book_id: string }
}

export async function getServerSideProps({ params }: Args) {
  const rawTodos = await getAllTodos(params.book_id)
  const todos = rawTodos || []
  return { props: { todos } }
}
