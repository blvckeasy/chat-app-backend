import UserStatusService from "../user-status/user-status.service.js";
import { InvalidDataError, TokenIsInvalid } from "../utils/error.js";
import { writeFile } from "../utils/file.js";
import { generateFileName } from "../utils/generate.js";
import JWT from "../utils/jwt.js";
import { fetchAll } from "../utils/postgres.js"
import { UserService } from "./user.service.js";
import MessageService from '../message/message.servise.js'


export async function uploadProfileImage (req, res, next) {
  try {
    const { token } = req.headers;
    if (!token) throw new InvalidDataError(400, "Token is require!", "token");
    
    const user = JWT.verify(token);
    const { originalname, buffer } = req.file;
    const filename = generateFileName(originalname);

    writeFile(filename, buffer);

    const updatedUserProfile = (await fetchAll(`
      UPDATE users SET profile_img_url = $1 WHERE id = $2 RETURNING *;
    `, filename, user.id))[0];

    return res.send({
      ok: true,
      user: updatedUserProfile,
      profileImgName: filename,
    })
  } catch (error) {
    next(error);
  }
}

// in the future, it is possible to implement the function of excluding the last registered users to the first of the chat, as in Telegram.
export async function getUsers (req, res, next) {
  try {
    const { token } = req.headers;
    if (!token) throw new TokenIsInvalid(400, "Token is required!");

    const USER = JWT.verify(token);

    let users = await UserService.getUsers()
    users = await Promise.all(users.filter((user) => user.id != USER.id))

    let usersWithStatus = await Promise.all(users.map(async (user) => {
      const status = await UserStatusService.getUserLastStatus(user.id)
      delete status?.user_id;

      user.status = status;
      user.lastMessage = await MessageService.getLastMessage(USER.id, user.id);

      return user;
    }));

    return res.send({
      ok: true,
      users: usersWithStatus,
    })
  } catch (error) {
    next(error);
  }
}