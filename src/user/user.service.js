import { UserNotFoundError } from "../utils/error.js"
import { fetch } from "../utils/postgres.js"

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
}