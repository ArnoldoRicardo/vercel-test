import App from 'src/app'
import { getTodos } from 'utils/todoGraphqlClient'

type Args = {
  params: { book_id: string }
}

export default async function Page({ params }: Args) {
  const todos = await getTodos()
  return (
    <>
      <App rawTodos={todos} />
    </>
  )
}
