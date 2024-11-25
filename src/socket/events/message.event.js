import MessageModel from "../../database/models/message.model.js";
import UserModel from "../../database/models/user.model.js";
import { BaseError } from "../../errors/base.error.js";
import { Utils } from "../../helpers/utils.js";


export class MessageEvent {
    newMessage = async (data, socket) => {
        try {
            const { to_user_id, message } = data;
            if (!Utils.isValidObjectId(to_user_id)) throw new BaseError("Noto'g'ri id ishlatildi!");


            const { user } = socket;
            const friend = (await UserModel.findById(to_user_id)).toObject();

            const newMessage = await MessageModel.create({
                from_user_id: user.id,
                to_user_id,
                message,
            });

            socket.to(friend?.socket_id).emit("new:message", newMessage);
            socket.emit("new:message", newMessage);

        } catch (error) {
            console.log(error);
            socket.emit("error", error);
        }
    };

    editMessage = async (data, socket) => {
        try {
            const { message_id, message } = data;
            const { user } = socket;

            if (!Utils.isValidObjectId(message_id)) throw new BaseError("Noto'g'ri id ishlatildi!");
            

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

            socket.to(friend.socket_id).emit("edit:message", updatedMessage);
            socket.emit("edit:message", updatedMessage);

        } catch (error) {
            console.log(error);
            socket.emit("error", error);
        }
    };

    deleteMessage = async (data, socket) => {
        try {
            const { message_id } = data;
            const { user } = socket;

            if (!Utils.isValidObjectId(message_id)) throw new BaseError("Noto'g'ri id ishlatildi!");

            const deletedMessage = (
                await MessageModel.findOneAndDelete({
                    _id: message_id,
                    from_user_id: user.id
                })
            ).toObject();

            if (!deletedMessage) throw new BaseError("Messageni o'chirib bo'lmadi!")
            const friend = await UserModel.findOne({ _id: deletedMessage.to_user_id });

            socket.to(friend.socket_id).to(user.socket_id).emit("delete:message", deletedMessage);
        } catch (error) {
            console.log(error);
            socket.emit("error", error);
        }
    };
}
