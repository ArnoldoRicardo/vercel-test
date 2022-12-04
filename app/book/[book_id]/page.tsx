import App from '../../../src/components/app'
// import { getAllTodos } from '../../../utils/todoService'

type Args = {
  params: { book_id: string }
}

export default async function Page({ params }: Args) {
  // const todos = await getAllTodos(params.book_id)
  const todos = [] as Todo[]
  return (
    <>
      <App RawTodos={todos} />
    </>
  )
}
