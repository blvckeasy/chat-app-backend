import { fetch } from "../utils/postgres.js"

export async function getUser(id) {
    try {
        const query = `SELECT * FROM USERS WHER id = $1;`
        const foundUser = await fetch(query, id);
        return {
            user: foundUser
        }
    } catch (error) {
        next(error);
    }
}