import UserStatusService from '../user-status/user-status.service.js';
import { UserService } from '../user/user.service.js'
import { InternalServerError } from '../utils/error.js'
import { SocketMessageRoutes } from './socket.message.js'


export default async function SocketConnection(socket) {
    const { user } = socket;
    if (!user) throw new InternalServerError(400, 'user not found!')

    await UserService.updateUserSocketId(user.id, socket.id);
    await UserStatusService.insertUserStatus(user.id, "ONLINE");
    socket.broadcast.emit('user-connected', user);

    socket.on("test", async () => {
        socket.emit("working", "ok ishladi");
    })

    socket.on('post:message', async data =>
        SocketMessageRoutes.postMessage.call(null, socket, data)
    )

    socket.on('edit:message', async data =>
        SocketMessageRoutes.editMessage.call(null, socket, data)
    )

    socket.on('delete:message', async data =>
        SocketMessageRoutes.deleteMessage.call(null, socket, data)
    )

    socket.on('disconnect', async () => {
        await UserStatusService.insertUserStatus(user.id, "OFFLINE");
        socket.broadcast.emit('user-disconnected', user);
    })
}
