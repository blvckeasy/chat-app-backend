import { fetch, pool } from '../utils/postgres.js'
import { UserNotFoundError } from '../utils/error.js'

export async function login(username, password) {
  const query = `
      SELECT * FROM USERS WHERE USERNAME = $1 and PASSWORD = $2;
    `

  const foundUser = await fetch(query, username, password)
  
  if (!foundUser) throw new UserNotFoundError(404, "user not found!");
  
}
