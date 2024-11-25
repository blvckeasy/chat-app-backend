import { Router } from "express";
import { MessageController } from "../controllers/message.controller.js";


const router = Router();
const messageController = new MessageController();

router.get("/:userId", (req, res, next) => messageController.getAllMessages(req, res, next))

export default {
    path: "/messages",
    router
}