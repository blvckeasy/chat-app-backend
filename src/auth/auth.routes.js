import Express from 'express';
import { login, registration } from './auth.controller.js'

const AuthRouter = Express.Router()

AuthRouter
    .post('/signin', login)
    .post('/signup', registration)

export default AuthRouter