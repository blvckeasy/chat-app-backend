import UserModel from "../database/models/user.model.js";
import { BaseError, InternalServerError } from "../errors/base.error.js";
import { TokenError } from "../errors/jwt.error.js";
import { JWT } from "../helpers/jwt.js";
import { MessageEvent } from './events/message.event.js'


export default async function webSocket (io) {    
    io.on("connection", async (socket) => {
        const messageEvent = new MessageEvent();
        try {
            const socket_id = socket.id;
            const token = socket.handshake.headers?.token;

            if (!token) throw new TokenError("Token is required!" )

            const parsedToken = await JWT.verify(token);
            const user = (await UserModel.find({ _id: parsedToken._id }))[0];

            if (!user) throw new BaseError("Foydalanuvchi malumotlari topilmadi!");

            const updatedUser = await UserModel.findOneAndUpdate({
                _id: user?._id,
            }, {
                socket_id
            }, { new: true });

            socket.user = updatedUser;
            socket.broadcast.emit("user:connected", updatedUser);

            socket.on("new:message", (data) => messageEvent.newMessage(data, socket));
            socket.on("edit:message", (data) => messageEvent.editMessage(data, socket));
            socket.on("delete:message", (data) => messageEvent.deleteMessage(data, socket));

        } catch (error) {
            if (error instanceof BaseError) {
                socket.emit('error', error);
                return;
            }
            socket.emit('error', new InternalServerError());
        }


        socket.on("disconnect", () => {
            socket.broadcast.emit("user:disconnected", socket.user?._id);
        })
    })
}