import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { sign, verify } from './utils/jwt.js';
import multer from 'multer';
import AuthRouter from './auth/auth.routes.js'
import MessageRouter from './message/message.routes.js';

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
      req.user = verify(token);
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

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('new:message', (data) => {
    console.log(data)
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/:id', (req, res) => {
  res.send(sign({ id: req.params.id  }));
});

app.get('/verify', (req, res) => {
  res.send(verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoiaXRzIHdvcmsiLCJpYXQiOjE2OTQ4NzAxNDEsImV4cCI6MTcwMDA1NDE0MX0.WYtOH89ep6Bkpo2pFqmeflZwtTSPHPMVy5CORQFnA30"));
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
