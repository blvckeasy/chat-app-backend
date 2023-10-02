import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import JWT from './utils/jwt.js';
import AuthRouter from './auth/auth.routes.js'
import MessageRouter from './message/message.routes.js';

import middleware from './socket/socket.middleware.js'
import SocketConnection from './socket/socket.connection.js'

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


io.use(middleware)
io.on('connection', SocketConnection);

app.use((err, req, res, next) => {
  return res.send({
    ok: false,
    error: err
  })
})

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});