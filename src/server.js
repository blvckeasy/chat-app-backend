import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { exec } from 'child_process';

import JWT from './utils/jwt.js';
import multer from 'multer';
import AuthRouter from './auth/auth.routes.js'
import MessageRouter from './message/message.routes.js';
import { UserService } from './user/user.service.js'
import { Forbidden, InvalidDataError, UserAlreayExistsError, UserNotFoundError } from './utils/error.js'
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

  socket.on('new:message', async (data) => {
    const { to_user_id, message } = data;
    if (!(to_user_id && message)) {
      return socket.emit('error', new InvalidDataError(400, "to_user_id and message must be required!", "to_user_id"))
    }

    if (typeof(message) !== "string" || !message.length || message.length > 512) {
      return socket.emit('error', new InvalidDataError(400, "message must be string and length [1; 512]"))
    }

    const toUser = await UserService.getUserWithId(to_user_id);
    const fromUser = await UserService.getUserWithId(socket.user.id);

    if (!toUser) return socket.emit('error', new UserNotFoundError(400, "to_user not found"));
    if (!fromUser) return socket.emit('error', new Forbidden(405, "You are prohibited from this operation."))

    const newMessage = await MessageService.postMessage(fromUser.id, toUser.id, message);

    socket.to(toUser.socket_id).emit("new:message", newMessage);
    socket.emit("new:message", newMessage);
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/:id', async (req, res) => {
  res.send(JWT.sign(await UserService.getUserWithId('1')));
});

app.get('/verify', (req, res) => {
  res.send(JWT.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoiaXRzIHdvcmsiLCJpYXQiOjE2OTQ4NzAxNDEsImV4cCI6MTcwMDA1NDE0MX0.WYtOH89ep6Bkpo2pFqmeflZwtTSPHPMVy5CORQFnA30"));
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