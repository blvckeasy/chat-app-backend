import Express from 'express';
import { getMessages, postMessage } from './message.controller.js'

const MessageRouter = Express.Router()

MessageRouter
    .get('/', getMessages)
    .post('/', postMessage)

export default MessageRouter