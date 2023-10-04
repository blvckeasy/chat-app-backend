import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Multer from 'multer';
import Path from 'path';

import AuthRouter from './auth/auth.routes.js'
import MessageRouter from './message/message.routes.js';

import socketMiddleware from './socket/socket.middleware.js'
import SocketConnection from './socket/socket.connection.js'
import { InternalServerError, InvalidDataError } from './utils/error.js';
import { writeFile } from './utils/file.js';
import { generateFileName } from './utils/generate.js';
import JWT from './utils/jwt.js';
import { fetchAll } from './utils/postgres.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;
const upload = Multer({ limits: 5 * 1000 * 1000 })

app.use(express.static(Path.join(process.cwd(), "uploads")))
app.use(express.json())
app.use("/auth", AuthRouter)
app.use("/messages", MessageRouter)
// app.use("/user", UserRouter)

app.post("/profile/image", upload.single('image'), async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) throw new InvalidDataError(400, "Token is require!", "token");
    
    const user = JWT.verify(token);
    const { originalname, buffer } = req.file;
    const filename = generateFileName(originalname);

    writeFile(filename, buffer);

    const updatedUserProfile = (await fetchAll(`
      UPDATE users SET profile_img_url = $1 WHERE id = $2 RETURNING *;
    `, filename, user.id))[0];

    return res.send({
      ok: true,
      user: updatedUserProfile,
      profileImgName: filename,
    })
  } catch (error) {
    next(error);
  }
})


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
