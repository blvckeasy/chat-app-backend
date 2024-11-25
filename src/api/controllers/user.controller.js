import { BaseError } from '../../errors/base.error.js';
import { UserService } from '../../services/user.service.js';
import { JWT } from '../../helpers/jwt.js';

class UserController {
    #userService = new UserService();   

    async getAllUsers (req, res, next) {
        try {
            const { page, limit } = req.query;
            const users = await this.#userService.get({ page, limit }); 

            res.send({
                ok: true,
                message: "Foydalanuvchi malumotlari muvofaqqiyatli topildi!",
                data: users
            }).status(200);

        } catch (error) {
            next(error);
        }
    }

    async signin (req, res, next) {
        try {
            const userAgent = req.get("User-Agent");
            const { username, password } = req.body;
            const foundUser = await this.#userService.getOne({ username, password });

            if (!foundUser) throw new BaseError("Foydalanuvchi malumotlari topilmadi!");

            const accessToken = await JWT.sign({ ...foundUser, role: 'user', userAgent }, true);
            res.send({
                ok: true,
                message: "Foydalanuvchi malumotlari muvofaqqiyatli topildi!",
                token: {
                    accessToken,
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async signup (req, res, next) {
        try {
            const userAgent = req.get("User-Agent");
            const { filename: profile_img_path } = req.file;
            const { username, password, fullname } = req.body;

            const foundUser = await this.#userService.getOne({ username });
            if (foundUser) throw new BaseError("Bu username bor!")

            const newUser = await this.#userService.create({ 
                username, password, fullname, profile_img_path
            })

            const accessToken = await JWT.sign({ ...newUser, role: 'user', userAgent }, true);
            res.send({
                ok: true,
                message: "Foydalanuvchi malumoti yaratildi.",
                data: newUser,
                token: {
                    accessToken,
                }
            })
        } catch (error) {
            next(error);
        }
    }
}


export { UserController };