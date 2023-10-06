import { UserNotFoundError } from "../utils/error.js"
import { fetch, fetchAll } from "../utils/postgres.js"

export class UserService { 
    static async getUserWithId (userId) {
        const foundUser = await fetch(`SELECT * FROM USERS WHERE id = $1 and deleted_at IS NULL;`, userId)
        return foundUser
    }

    static async updateUserSocketId (userId, socketId) {
        const foundUser = this.getUserWithId(userId);
        if (!foundUser) throw new UserNotFoundError(400, "user not found!")
        
        const updatedUser = await fetch(`UPDATE users SET socket_id = $1 WHERE id = $2 and deleted_at IS NULL RETURNING *;`, socketId, userId)
        return updatedUser
    }

    static async getUsers () {
        const users = await fetchAll(`
            SELECT id, profile_img_url, full_name, username, bio FROM users WHERE deleted_at IS NULL ORDER BY id;
        `) 

        return users;
    }
}