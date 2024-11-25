import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { connectDatabase } from './database/index.js';
import setupRoutes from './api/routes/index.js'
import { errorHandlerMiddleware } from './api/middlewares/error.middleware.js';
import webSocket from './socket/index.js';

async function bootstrap () {
    const PORT = process.env.PORT || 3000;
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*"
        },
    });

    app.use(express.json())

    await connectDatabase();
    await setupRoutes(app);

    app.get("/", (req, res) => {
        res.send("ok");
    })

    app.use((error, req, res, next) => errorHandlerMiddleware(error, req, res, next))

    await webSocket(io);

    server.listen(PORT, () => console.log("server is listening on 3000"))
}


bootstrap()