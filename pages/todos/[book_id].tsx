import App from '../../src/components/app'
import { getAllTodos } from '../../utils/todoService'

type PageProps = {
  todos?: Todo[]
}

export default function Books({ todos }: PageProps) {
  return (
    <section className="todoapp">
      <App RawTodos={todos} />
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
