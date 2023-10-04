import { Router } from 'express'
import { uploadProfileImage } from './user.controller'
import Multer from 'multer';

const upload = Multer({ limits: 5 * 1000 * 1000 })
const router = Router()

router
    .post("/profile/image", upload.single('image'), uploadProfileImage)



export default router