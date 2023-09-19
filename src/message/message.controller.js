import { InvalidDataError, PaginationError, UserNotFoundError } from "../utils/error.js"
import { fetch, fetchAll } from "../utils/postgres.js"
import { PAGINATION } from "../../config.js";

export async function getMessages(req, res, next) {
    try {
        const { friendUserId } = req.query;
        const { page, limit } = { page: req.query.page || PAGINATION.page, limit: req.query.limit || PAGINATION.limit }
        const { user } = req

        if (!user?.id) throw new InvalidDataError(400, "user not found!", "user")
        if (!friendUserId) throw new InvalidDataError(400, "friendUserId is require!", "friendUserId");
        if (page <= 0) throw new PaginationError(400, "page must be valid. (page > 0)", "page");
        if (limit <= 0) throw new PaginationError(400, "limit must be valid, (limit > 0)", "limit");

        const foundMessages = await fetchAll(`
            SELECT * FROM MESSAGES 
            WHERE 
                from_user_id = $1 and to_user_id = $2 or
                from_user_id = $2 and to_user_id = $1
            LIMIT $3
            OFFSET $4;
        `, friendUserId, user.id, limit, page * limit - limit);
        
        return res.send({
            ok: true,
            messages: foundMessages,
        })    
    } catch (error) {
        next(error)
    }
}

export async function postMessage(req, res, next) {
    try {
        let { toUserId, message } = req.body;
        const { user } = req;

        if (!user) throw new InvalidDataError(400, "user is not found!", 'user');
        if (!toUserId) throw new InvalidDataError(400, "toUserId is require!", 'toUserId');
        if (!message || typeof(message) !== "string" || !message.trim().length) throw new InvalidDataError(400, "message must be require and typeof stiring", "message");
        if (user.id == toUserId) throw new InvalidDataError(400, "not allowed", "toUserId");

        message = message.trim()
        const foundUser = await fetch(`SELECT * FROM USERS WHERE id = $1;`, toUserId);
        if (!foundUser) throw new UserNotFoundError(400, "your friend is not found!");

        const newMessage = await fetch(`INSERT INTO messages (from_user_id, to_user_id, message) VALUES ($1, $2, $3) RETURNING *;`, user.id, toUserId, message);
        return res.send({
            ok: true,
            newMessage,
        })
    } catch (error) {
        next(error);
    }
}