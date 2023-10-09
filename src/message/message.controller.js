import { InvalidDataError, PaginationError } from "../utils/error.js"
import JWT from "../utils/jwt.js";
import MessageService from "./message.servise.js"

export async function getMessages(req, res, next) {
    try {
        const { friendUserId, page, limit } = req.query;
        const { token } = req.headers;
        
        if (!token) throw new InvalidDataError(400, "Token is require!", "token"); 
        
        const user = JWT.verify(token);
        
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

export async function getLastMessage(req, res, next) {
    try {
        const { friendUserID } = req.body;
        const { token } = req.headers;

        if (!token) throw new InvalidDataError(400, "Token is require!", "token"); 
        if (!friendUserID) throw new InvalidDataError(400, "friendUserID is require!", "friendUserID");

        const user = JWT.verify(token);

        console.log(user.id, friendUserID);
        const lastMessage = await MessageService.getLastMessage(user.id, friendUserID);

        return res.send({
            ok: true,
            lastMessage,
        })
    } catch (error) {
        next(error);
    }
}

export async function postMessage(req, res, next) {
    try {
        let { toUserId, message } = req.body;
        const { token } = req.headers;

        if (!token) throw new InvalidDataError(400, "Token is require!", "token"); 
        
        const user = JWT.verify(token);
        const newMessage = await MessageService.insert(user.id, toUserId, message);
        
        return res.send({
            ok: true,
            newMessage,
        })
    } catch (error) {
        next(error);
    }
}