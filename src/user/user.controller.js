import { InvalidDataError, TokenIsInvalid } from "../utils/error.js";
import { writeFile } from "../utils/file.js";
import { generateFileName } from "../utils/generate.js";
import JWT from "../utils/jwt.js";
import { fetchAll } from "../utils/postgres.js"
import { UserService } from "./user.service.js";



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

export async function getUsers (req, res, next) {
  try {
    const { token } = req.headers;
    if (!token) throw new TokenIsInvalid(400, "Token is required!");

    const users = await UserService.getUsers();

    return res.send({
      ok: true,
      users
    })
  } catch (error) {
    next(error);
  }
}