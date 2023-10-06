import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Path from 'path';
import Cors from 'cors';

import AuthRouter from './auth/auth.routes.js'
import UserRouter from './user/user.routes.js';
import MessageRouter from './message/message.routes.js';
import UserStatusRouter from './user-status/user-status.routes.js';
import socketMiddleware from './socket/socket.middleware.js'
import SocketConnection from './socket/socket.connection.js'

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;

app.use(Cors("*"))
app.use(express.static(Path.join(process.cwd(), "uploads")))
app.use(express.json())

app.use("/auth", AuthRouter)
app.use("/messages", MessageRouter)
app.use("/user", UserRouter)
app.use("/status", UserStatusRouter);

app.get("/", (_, res) => {
  return res.send({
    author: "blvckeasy",
    repo: "https://github.com/blvckeasy/"
  })
})

io.use(socketMiddleware)
io.on('connection', SocketConnection);

app.use((err, req, res, next) => {
  console.log(err);
  return res.send({
    ok: false,
    error: err
  })
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
