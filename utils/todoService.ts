import { pool } from './db'
import { GraphQLError } from 'graphql'

export const getAllTodos = async (book_id: string): Promise<Todo[]> => {
  const sql_select = `
    --sql
    select 
        id
        , text
        , completed
        , sort
    from public."todo" 
    where
        book_id = ${book_id}
    `
  const client = await pool.connect()
  try {
    const res = await client.query(sql_select)
    return res.rows
  } catch (err: any) {
    throw new GraphQLError(err.message)
  } finally {
    client.release()
  }
}

export const addTodo = async (text: string, id: string): Promise<Todo> => {
  const sql_select = `
    --sql
    INSERT INTO public."todo" 
    ("id", "text") 
    VALUES 
        ('${id}', '${text}')
    RETURNING *;
    `
  const client = await pool.connect()
  try {
    const res = await client.query(sql_select)
    return res.rows[0]
  } catch (err: any) {
    throw new GraphQLError(err.message)
  } finally {
    client.release()
  }
}

export const updateTodo = async ({
  id,
  ...update
}: TodoUpdate): Promise<Todo> => {
  const entries = String(
    Object.entries(update).map(([key, value]) =>
      typeof value === 'number' ? `"${key}"=${value}` : `"${key}"='${value}'`
    )
  )
  const sql_select = `
    --sql
    UPDATE public.todo
	SET ${entries}
    WHERE id='${id}'
    RETURNING *;
    `
  const client = await pool.connect()
  try {
    const res = await client.query(sql_select)
    return res.rows[0]
  } catch (err: any) {
    throw new GraphQLError(err.message)
  } finally {
    client.release()
  }
}

export const deleteTodos = async (ids: string[]): Promise<void> => {
  const values = String(Object.values(ids).map((id) => "'" + id + "'"))
  const sql_select = `
    --sql
    DELETE FROM public.todo
	WHERE id in (${values});
    `
  console.log(sql_select)
  const client = await pool.connect()
  try {
    const res = await client.query(sql_select)
  } catch (err: any) {
    throw new GraphQLError(err.message)
  } finally {
    client.release()
  }
}

export const completeTodos = async (ids: string[]): Promise<void> => {
  const values = String(Object.values(ids).map((id) => "'" + id + "'"))
  const sql_select = `
    --sql
    UPDATE public.todo
	SET completed=true
	WHERE id in (${values});
    `
  const client = await pool.connect()
  try {
    const res = await client.query(sql_select)
  } catch (err: any) {
    throw new GraphQLError(err.message)
  } finally {
    client.release()
  }
}
