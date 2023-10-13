import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import socketMiddleware from './socket/socket.middleware.js'
import SocketConnection from './socket/socket.connection.js'
import Routes from './routes.js';
import { ErrorHandlerMiddleware, apiMiddlewares } from './apiMiddleware.js';


async function bootstrap() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    }
  });
  const port = process.env.PORT || 8080;

  await apiMiddlewares(app);
  await Routes(app);

  app.get("/api/v1/", (_, res) => {
    return res.send({
      author: "blvckeasy",
      repo: "https://github.com/blvckeasy/"
    })
  })

  io.use(socketMiddleware)
  io.on('connection', SocketConnection);

  app.use(ErrorHandlerMiddleware);

  server.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
}

bootstrap()