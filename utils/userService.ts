import { pool } from './db'
import { GraphQLError } from 'graphql'

export const findUser = async (username: string): Promise<userInDb> => {
  const sql_select = `
    --sql
    select 
        id
        , username
        , hasshed_password
    from public."User" 
    where 
        "username" = '${username}'
        and is_active is true
    limit 1`
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

export const getAllUser = async (): Promise<userInDb[]> => {
  const sql_select = `
    --sql
    select 
        id
        , username
        , hasshed_password
    from public."User" 
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

export const newUser = async (username: string, hasshed_password: string) => {
  const sql = `
         --sql
            INSERT INTO public."User" (username,hasshed_password)
            VALUES ('${username}','${hasshed_password}')
            RETURNING *;
        `

  const client = await pool.connect()
  try {
    const res = await client.query(sql)
    return res.rows[0]
  } catch (err: any) {
    throw new GraphQLError(err.message)
  } finally {
    client.release()
  }
}
