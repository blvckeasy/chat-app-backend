import { UserService } from "../user/user.service.js";
import { Forbidden, InvalidDataError } from "../utils/error.js";
import JWT from "../utils/jwt.js";
import UserStatusService from "./user-status.service.js";

export default class UserStatusController {
    static async getUserLastStatus (req, res, next) {
        try {
            const { userID } = req.params;
            const lastActivity = await UserStatusService.getUserLastStatus(userID);
        
            return res.send({
                ok: true,
                lastActivity,
            })
        } catch (error) {
            next(error);
        }
    }

    static async getUserAllStatus (req, res, next) {
        try {
            const { token } = req.headers;
            const { page, limit } = req.query;

            if (!token) throw new InvalidDataError(400, "Token is not defined!", "token");

            const user = JWT.verify(token);
            const foundUser = await UserService.getUserWithId(user.id);
            
            if (!foundUser) throw new Forbidden(400, "user not found!");

            const userStatuses = await UserStatusService.getUserStatuses(user.id);        
            return res.send({
                ok: true,
                statuses: userStatuses
            })
        } catch (error) {
            next(error);
        }
    }
}