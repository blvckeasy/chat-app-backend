import { MessageService } from '../../services/message.service.js';
import { TokenError } from '../../errors/jwt.error.js'
import { JWT } from '../../helpers/jwt.js'


class MessageController {
    #messageService = new MessageService();

    async getAllMessages (req, res, next) {
        try {
            const token = req.headers.token;
            if (!token) throw new TokenError("Ushbu so'rov uchun token kiritilmadi!");

            const parsedToken = await JWT.verify(token);
            const to_user_id = req.params.to_user_id;
            const from_user_id = parsedToken._id;
            
            const messages = await this.#messageService.get({ 
                $or: [
                    { from_user_id, to_user_id },
                    { from_user_id: to_user_id, to_user_id: from_user_id },
                ]
            });

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