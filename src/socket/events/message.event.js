import MessageModel from "../../database/models/message.model.js";
import UserModel from "../../database/models/user.model.js";
import { BaseError } from "../../errors/base.error.js";

export class MessageEvent {
    socket;

    constructor(io, socket) {
        this.socket = socket;
    }

    newMessage = async (data) => {
        try {
            const { to_user_id, message } = data;
            const friend = (await UserModel.findById(to_user_id)).toObject();

            const { user } = this.socket;

            const newMessage = await MessageModel.create({
                from_user_id: user.id,
                to_user_id,
                message,
            });

            this.socket.to(friend?.socket_id).emit("new:message", newMessage);
            this.socket.emit("new:message", newMessage);

        } catch (error) {
            console.log(error);
            this.socket.emit("error", error);
        }
    };

    editMessage = async (data) => {
        try {
            const { message_id, message } = data;
            const { user } = this.socket;

            const foundMessage = (
                await MessageModel.findOne({
                    _id: message_id,
                    from_user_id: user._id,
                })
            ).toObject();
            if (!foundMessage)
                throw new BaseError(
                    "Bu message ochirishda sizda vakolat yo'q!"
                );

            const updatedMessage = (
                await MessageModel.findOneAndUpdate({ _id: message_id }, { message })
            ).toObject();
            const friend = (
                await UserModel.findOne({ _id: updatedMessage.to_user_id })
            ).toObject();

            this.socket.to(friend.socket_id).emit("edit:message", updatedMessage);
            this.socket.emit("edit:message", updatedMessage);

        } catch (error) {
            console.log(error);
            this.socket.emit("error", error);
        }
    };

    deleteMessage = async (data) => {
        try {
            const { message_id } = data;
            const { user } = this.socket;

            const deletedMessage = (
                await MessageModel.findOneAndDelete({
                    _id: message_id,
                    from_user_id: user.id
                })
            ).toObject();

            if (!deletedMessage) throw new BaseError("Messageni o'chirib bo'lmadi!")
            const friend = await UserModel.findOne({ _id: deletedMessage.to_user_id });

            this.socket.to(friend.socket_id).to(user.socket_id).emit("delete:message", deletedMessage);
        } catch (error) {
            console.log(error);
            this.socket.emit("error", error);
        }
    };
}
