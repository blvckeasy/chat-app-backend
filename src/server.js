import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { login } from './auth/auth.controller.js'
import { sign, verify } from './utils/jwt.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 8080;

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('new:message', (data) => {
    console.log(data)
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(express.json())

app.get('/', (req, res) => {
  res.send(sign({ 'test': 'its work' }));
});

app.get('/verify', (req, res) => {
  res.send(verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZXN0IjoiaXRzIHdvcmsiLCJpYXQiOjE2OTQ4NzAxNDEsImV4cCI6MTcwMDA1NDE0MX0.WYtOH89ep6Bkpo2pFqmeflZwtTSPHPMVy5CORQFnA30"));
});

app.post("/login", (req, res, next) => {
  const { username, password } = req.body;
  login(username, password)
});

server.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
