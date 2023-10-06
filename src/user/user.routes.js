import { Router } from 'express'
import Multer from 'multer';
import { getUsers, uploadProfileImage } from './user.controller.js'

const upload = Multer({ limits: 5 * 1000 * 1000 })
const UserRouter = Router()

UserRouter.get("/all", getUsers)
UserRouter.post("/profile/image", upload.single('image'), uploadProfileImage)


export default {
    path: '/user',
    router: UserRouter
}