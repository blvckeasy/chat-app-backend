import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { exec } from 'child_process';

import JWT from './utils/jwt.js';
import multer from 'multer';
import AuthRouter from './auth/auth.routes.js'
import MessageRouter from './message/message.routes.js';
import { UserService } from './user/user.service.js'
import { Forbidden, InvalidDataError, MessageNotFoundError } from './utils/error.js'
import MessageService from './message/message.servise.js'

const upload = multer({ dest: 'uploads/' })
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;


app.use(express.json())
app.use((req, res, next) => {
  try {
    const { token } = req.headers;
    if (token) {
      req.user = JWT.verify(token);
    } else {
      req.user = {}
    }
    next();
  } catch (error) {
    next(error)
  }
})
app.use("/auth", AuthRouter)
app.use("/messages", MessageRouter)


io.use(async function (socket, next) {
  try {
    const token = socket.handshake.query?.token
    if (!token) throw new InvalidDataError(400, "Token is require!");
    
    socket.user = JWT.verify(token)
    if (socket.user) {
      socket.user.socket_id = socket.id;
    }

    next()
  } catch (error) {
    next(error)
  }  
})

io.on('connection', async (socket) => {
  console.log('user connected');
  const { user } = socket;
  if (!user) throw new InternalServerError(400, "user not found!")
  
  await UserService.updateUserSocketId(user.id, socket.id)

  socket.on('post:message', async (data) => {
    try {
      const { to_user_id, message } = data;
      if (!(to_user_id && message)) throw new InvalidDataError(400, "to_user_id and message must be required!", "to_user_id");

      const newMessage = await MessageService.postMessage(user.id, to_user_id, message);
      const toUser = await UserService.getUserWithId(to_user_id);

      socket.to(toUser.socket_id).emit("new:message", newMessage);
      socket.emit("new:message", newMessage);
    } catch (error) {
      socket.emit('error', error);
    }
  })

  socket.on('edit:message', async (data) => {
    try {
      const { message_id, message } = data;

      if (!message_id) throw new InvalidDataError(400, "message_id is required!", "message_id");
      
      const foundMessage = await MessageService.getMessage(message_id);
      if (!foundMessage) throw new MessageNotFoundError(400, "Message not found!");

      if (foundMessage?.from_user_id != user.id) throw new Forbidden(500, "you are prohibited from performing this operation.");

      const updatedMessage = await MessageService.updateMessage(message_id, message);
      const toUser = await UserService.getUserWithId(updatedMessage.to_user_id);
      
      socket.to(toUser.socket_id).emit("message:updated", updatedMessage);
      socket.emit("message:updated", updatedMessage);
    } catch (error) {
      console.log(error);
      socket.emit('error', error);
    }
  })

  socket.on('delete:message', async (data) => {
    try {
      const { message_id } = data;
      const foundMessage = await MessageService.getMessage(message_id);
      
      if (!foundMessage) throw new MessageNotFoundError("message not found!");
      if (foundMessage?.from_user_id != user.id) throw new Forbidden(500, "you are prohibited from performing this operation.");

      const deletedMessage = await MessageService.deleteMessage(message_id);
      const toUser = await UserService.getUserWithId(deletedMessage.to_user_id);

      socket.to(toUser.socket_id).emit('message:deleted', deletedMessage);
      socket.emit('message:deleted', deletedMessage);
    } catch (error) {
      console.log(error);
      socket.emit('error', error);
    }
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use((err, req, res, next) => {
  console.log(err)
  res.send({
    error: err
  })
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});