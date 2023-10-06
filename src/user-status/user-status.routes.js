import { Router } from 'express';
import UserStatusController from './user-status.controller.js';

const UserStatusRouter = Router()

UserStatusRouter.get('/last/:userID', UserStatusController.getUserLastStatus)
UserStatusRouter.get('/mystatus', UserStatusController.getUserAllStatus)

export default {
    path: '/user-status',
    router: UserStatusRouter
}