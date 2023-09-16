import pg from 'pg'
import { PG_USER, PG_PASSWORD, PG_DATABASE, PG_PORT, PG_HOST } from '../../config.js'

export const pool = new pg.Pool({
	user: PG_USER,
	password: PG_PASSWORD,
	database: PG_DATABASE,
	port: PG_PORT,
	host: PG_HOST,
})

export async function fetch (query, ...params) {
	const client = await pool.connect()
	try {
		const { rows: [ row ] } = await client.query(query, params.length ? params : null)
		return row
	} catch(error) {
		throw error
	} finally {
		client.release()
	}
}

export async function fetchAll (query, ...params) {
	const client = await pool.connect()
	try {
		const { rows } = await client.query(query, params.length ? params : null)
		return rows
	} catch(error) {
		throw error
	} finally {
		client.release()
	}
}
