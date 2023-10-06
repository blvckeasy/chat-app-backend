import Express from 'express';
import { getMessages, postMessage } from './message.controller.js'

const MessageRouter = Express.Router()

MessageRouter.get('/', getMessages) //  /messages?friendUserId=<id>&page=<int>&limit=<int>
MessageRouter.post('/postMessage', postMessage)

export default {
    path: '/messages',
    router: MessageRouter
}