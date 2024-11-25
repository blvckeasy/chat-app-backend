import { Router } from "express";
import { MessageController } from "../controllers/message.controller.js";
import { validateObjectIdMiddleware } from "../middlewares/validator.middleware.js";


const router = Router();
const messageController = new MessageController();

router.get("/:userId", validateObjectIdMiddleware, (req, res, next) => messageController.getAllMessages(req, res, next))

export default {
    path: "/messages",
    router
}