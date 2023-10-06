import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Path from 'path';
import Cors from 'cors';

import socketMiddleware from './socket/socket.middleware.js'
import SocketConnection from './socket/socket.connection.js'
import Routes from './routes.js';

async function bootstrap() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);
  const port = process.env.PORT || 8080;

  app.use(Cors("*"))
  app.use(express.static(Path.join(process.cwd(), "uploads")))
  app.use(express.json())

  await Routes(app);

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
}

bootstrap()