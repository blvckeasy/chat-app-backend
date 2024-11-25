import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { join, extname } from 'path';
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, join(process.cwd(), "uploads"));
    },
    filename: function (req, file, cb) {
        // Faylning nomini va kengaytmasini to'g'ri olish
        const fileExtension =   extname(file.originalname); // kengaytma olish
        const fileName = Date.now() + fileExtension; // Fayl nomini vaqt bo'yicha yaratish
        cb(null, fileName); // To'g'ri fayl nomini saqlash
    }
});
  
const upload = multer({ storage })
const router = Router();
const userController = new UserController();

router.get("/", (req, res, next) => userController.getAllUsers(req, res, next))
router.post("/signin", (req, res, next) => userController.signin(req, res, next))
router.post("/signup", upload.single("profile_image"), (req, res, next) => userController.signup(req, res, next))


export default {
    path: "/users",
    router
}