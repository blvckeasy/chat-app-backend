import { InvalidDataError } from "../utils/error.js"
import JWT from "../utils/jwt.js"


export default async function middleware (socket, next) {
    try {
      const token = socket.handshake.query?.token
      if (!token) throw new InvalidDataError(400, "Token is require!");
      
      socket.user = JWT.verify(token)
      if (socket.user) {
        socket.user.socket_id = socket.id;
      }
  
      next()
    } catch (error) {
      next(error)
    }  
  }