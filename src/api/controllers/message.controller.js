import { MessageService } from '../../services/message.service.js';


class MessageController {
    #messageService = new MessageService();

    async getAllMessages (req, res, next) {
        try {
            const userId = req.params;
            const messages = await this.#messageService.get(userId);

            res.send({
                ok: true,
                message: "Chat malutlari topildi!",
                data: messages
            }).status(200);

        } catch (error) {
            next(error);
        }
    }
}


export { MessageController };