import MessageService from "../message/message.servise.js"
import { UserService } from "../user/user.service.js"
import { Forbidden, InvalidDataError, MessageNotFoundError } from "../utils/error.js"


export class SocketMessageRoutes {
    static async postMessage(socket, data) {
        try {
            const { to_user_id, message } = data
            const { user } = socket;
            if (!(to_user_id && message))
                throw new InvalidDataError(
                    400,
                    'to_user_id and message must be required!',
                    'to_user_id'
                )

            const newMessage = await MessageService.postMessage(
                user.id,
                to_user_id,
                message
            )
            const toUser = await UserService.getUserWithId(to_user_id)

            socket.to(toUser.socket_id).emit('new:message', newMessage)
            socket.emit('new:message', newMessage)
        } catch (error) {
            socket.emit('error', error)
        }
    }

    static async editMessage(socket, data) {
        try {
            const { message_id, message } = data
            const { user } = socket;

            if (!message_id)
                throw new InvalidDataError(
                    400,
                    'message_id is required!',
                    'message_id'
                )

            const foundMessage = await MessageService.getMessage(message_id)
            if (!foundMessage)
                throw new MessageNotFoundError(400, 'Message not found!')

            if (foundMessage?.from_user_id != user.id)
                throw new Forbidden(
                    500,
                    'you are prohibited from performing this operation.'
                )

            const updatedMessage = await MessageService.updateMessage(
                message_id,
                message
            )
            const toUser = await UserService.getUserWithId(
                updatedMessage.to_user_id
            )

            socket.to(toUser.socket_id).emit('message:updated', updatedMessage)
            socket.emit('message:updated', updatedMessage)
        } catch (error) {
            socket.emit('error', error)
        }
    }

    static async deleteMessage(socket, data) {
        try {
            const { message_id } = data;
            const { user } = socket;

            const foundMessage = await MessageService.getMessage(message_id)

            if (!foundMessage)
                throw new MessageNotFoundError('message not found!')
            if (foundMessage?.from_user_id != user.id)
                throw new Forbidden(
                    500,
                    'you are prohibited from performing this operation.'
                )

            const deletedMessage = await MessageService.deleteMessage(
                message_id
            )
            const toUser = await UserService.getUserWithId(
                deletedMessage.to_user_id
            )

            socket.to(toUser.socket_id).emit('message:deleted', deletedMessage)
            socket.emit('message:deleted', deletedMessage)
        } catch (error) {
            socket.emit('error', error)
        }
    }
}
