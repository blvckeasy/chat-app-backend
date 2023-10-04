import { Router } from 'express'
import Multer from 'multer';
import { uploadProfileImage } from './user.controller.js'

const upload = Multer({ limits: 5 * 1000 * 1000 })
const UserRouter = Router()

UserRouter
    .post("/profile/image", upload.single('image'), uploadProfileImage)



export default UserRouter