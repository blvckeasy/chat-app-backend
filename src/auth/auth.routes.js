import Express from 'express';
import { login, registration } from './auth.controller.js'

const AuthRouter = Express.Router()

AuthRouter.post('/signin', login)
AuthRouter.post('/signup', registration)

export default {
    path: '/auth',
    router: AuthRouter
}