import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Path from 'path';
import Cors from 'cors';

import AuthRouter from './auth/auth.routes.js'
import MessageRouter from './message/message.routes.js';

import socketMiddleware from './socket/socket.middleware.js'
import SocketConnection from './socket/socket.connection.js'
import { InternalServerError, InvalidDataError } from './utils/error.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;

app.use(Cors("*"))
app.use(express.static(Path.join(process.cwd(), "uploads")))
app.use(express.json())
app.use("/auth", AuthRouter)
app.use("/messages", MessageRouter)
// app.use("/user", UserRouter)


io.use(socketMiddleware)
io.on('connection', SocketConnection);

app.use((err, req, res, next) => {
  console.log(err);
  console.log(err instanceof InternalServerError);
  return res.send({
    ok: false,
    error: err
  })
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
