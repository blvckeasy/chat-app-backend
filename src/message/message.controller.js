import { InvalidDataError, PaginationError, UserNotFoundError } from "../utils/error.js"
import MessageService from "./message.servise.js"

export async function getMessages(req, res, next) {
    try {
        const { friendUserId, page, limit } = req.query;
        const { user } = req

        if (!user?.id) throw new InvalidDataError(400, "user not found!", "user")
        if (!friendUserId) throw new InvalidDataError(400, "friendUserId is require!", "friendUserId");
        if (page <= 0) throw new PaginationError(400, "page must be valid. (page > 0)", "page");
        if (limit <= 0) throw new PaginationError(400, "limit must be valid, (limit > 0)", "limit");

        const foundMessages = await MessageService.selectAll(user.id, friendUserId, page, limit);
        
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
        
        const newMessage = await MessageService.insert(user.id, toUserId, message);
        return res.send({
            ok: true,
            newMessage,
        })
    } catch (error) {
        next(error);
    }
}