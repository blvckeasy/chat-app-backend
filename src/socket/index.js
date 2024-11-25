import UserModel from "../database/models/user.model.js";
import { BaseError } from "../errors/base.error.js";
import { JWT } from "../helpers/jwt.js";
import { MessageEvent } from './events/message.event.js'


export default async function webSocket (io) {    
    io.on("connection", async (socket) => {
        const messageEvent = new MessageEvent(socket);
        try {
            const socket_id = socket.id;
            const token = socket.handshake.headers?.token;

            if (!token) throw new BaseError("Token is required!" )

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

            socket.on("new:message", messageEvent.newMessage.bind(this))
            socket.on("edit:message", messageEvent.editMessage.bind(this))
            socket.on("delete:message", messageEvent.deleteMessage.bind(this))

        } catch (error) {
            console.log(error);
            socket.emit('error', error);
        }


        socket.on("disconnect", () => {
            socket.broadcast.emit("user:disconnected", user._id);
        })
    })
}