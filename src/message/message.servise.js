import { InvalidDataError, MessageNotFoundError, UserNotFoundError } from "../utils/error.js"
import { fetchAll, fetch } from "../utils/postgres.js"
import { PAGINATION } from "../../config.js"
import { UserService } from "../user/user.service.js"


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

    static async getMessage(message_id) {
        if (!message_id) throw new InvalidDataError(404, "Message_id is require!", "message_id");
    
        const foundMessage = await fetch(`
            SELECT * FROM MESSAGES WHERE id = $1 and deleted_at IS NULL;
        `, message_id);
        return foundMessage;
    }

    static async postMessage (fromUserId, toUserId, message) {
        if (!toUserId) throw new InvalidDataError(400, "toUserId is require!", 'toUserId');
        if (!fromUserId) throw new InvalidDataError(400, "fromUserId is require!", 'fromUserId');
        if (fromUserId == toUserId) throw new InvalidDataError(400, "not allowed", "toUserId");
    
        const toUser = await UserService.getUserWithId(toUserId);
        const fromUser = await UserService.getUserWithId(fromUserId);
    
        if (!toUser) throw UserNotFoundError(400, "toUser not found");
        if (!fromUser) throw UserNotFoundError(400, "fromUser not found");
        
        if (!message || typeof(message) !== "string" || !message.trim().length) 
            throw new InvalidDataError(400, "message must be require and typeof stiring", "message");

        const newMessage = await fetch(`
            INSERT INTO messages (from_user_id, to_user_id, message) VALUES ($1, $2, $3) RETURNING *;
        `, fromUserId, toUserId, message.trim());
        return newMessage
    }

    static async updateMessage (message_id, newMessage) {
        const foundMessage = await this.getMessage(message_id);
        if (!foundMessage) throw new MessageNotFoundError(400, "message not found!");
        
        if (!newMessage || typeof(newMessage) !== "string" || !newMessage.trim().length) 
            throw new InvalidDataError(400, "message must be require and typeof stiring", "message");

        const updatedMessage = await fetch(`
            UPDATE messages SET message = $1 WHERE id = $2 and deleted_at IS NULL RETURNING *;
        `, newMessage, message_id);

        return updatedMessage;
    }

    static async deleteMessage(message_id) {
        const foundMessage = await this.getMessage(message_id);
        if (!foundMessage) throw new MessageNotFoundError(404, "message not found!");

        const deletedMessage = await fetch(`
            UPDATE messages SET deleted_at = NOW() WHERE id = $1 RETURNING *;
        `, message_id);
        
        return deletedMessage;
    }
}
