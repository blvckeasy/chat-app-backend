import Express from 'express';
import { getMessages, postMessage } from './message.controller.js'

const MessageRouter = Express.Router()

MessageRouter
    .get('/', getMessages) //  /messages?friendUserId=<id>&page=<int>&limit=<int>
    .post('/postMessage', postMessage)

export default MessageRouter 