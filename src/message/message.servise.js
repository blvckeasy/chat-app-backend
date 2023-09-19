import { PAGINATION } from "../../config.js"
import { InvalidDataError, UserNotFoundError } from "../utils/error.js"
import { fetchAll } from "../utils/postgres.js"


export default class MessageService {
    static async selectAll (userId_1, userId_2, page = PAGINATION.page, limit = PAGINATION.limit) {
        const foundMessages = await fetchAll(`
            SELECT * FROM MESSAGES 
            WHERE 
                from_user_id = $1 and to_user_id = $2 or
                from_user_id = $2 and to_user_id = $1 
                and DELETED_AT IS NULL
            LIMIT $3
            OFFSET $4;
        `, userId_1, userId_2, limit, page * limit - limit);
    
        return foundMessages
    }

    static async insert (fromUserId, toUserId, message) {
        if (!toUserId) throw new InvalidDataError(400, "toUserId is require!", 'toUserId');
        if (!fromUserId) throw new InvalidDataError(400, "fromUserId is require!", 'fromUserId');
        if (fromUserId == toUserId) throw new InvalidDataError(400, "not allowed", "toUserId");
        
        const foundUser = await fetch(`SELECT * FROM USERS WHERE id = $1;`, toUserId);

        if (!foundUser) throw new UserNotFoundError(400, "your friend is not found!");
        if (!message || typeof(message) !== "string" || !message.trim().length) throw new InvalidDataError(400, "message must be require and typeof stiring", "message");

        const newMessage = await fetch(`INSERT INTO messages (from_user_id, to_user_id, message) VALUES ($1, $2, $3) RETURNING *;`, fromUserId, toUserId, message.trim());
        return newMessage
    }
}
