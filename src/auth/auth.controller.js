import { fetch } from '../utils/postgres.js'
import {
    InvalidDataError,
    UserAlreayExistsError,
    UserNotFoundError,
} from '../utils/error.js';
import JWT from '../utils/jwt.js'

export async function login(req, res, next) {
    try {
        const { username, password } = req.body

        const foundUser = await fetch(`SELECT * FROM USERS WHERE USERNAME = $1 and PASSWORD = $2;`, username, password);
        if (!foundUser) throw new UserNotFoundError(404, 'user not found!')

        delete foundUser.password;
        delete foundUser.socket_id;
        
        return res.send({
            ok: true,
            user: foundUser,
            token: {
                access_token: JWT.sign(foundUser)
            }
        })
    } catch (error) {
        next(error)
    }
}

export async function registration(req, res, next) {
    try {
        const { username, password, confirm_password } = req.body
        console.log(username, password, confirm_password)

        if (!username)
            throw new InvalidDataError(400, 'username is required!', 'username')
        if (!password)
            throw new InvalidDataError(400, 'password is required!', 'password')
        if (!confirm_password)
            throw new InvalidDataError(
                400,
                'confirm_password is required!',
                'confirm_password'
            )

        if (password.length < 5 && password.length > 32)
            throw new InvalidDataError(
                400,
                'Password length must be [5; 32]',
                'password'
            )

        if (password !== confirm_password)
            throw new InvalidDataError(
                400,
                'Password and confirm password must be equal',
                'confirm_password'
            )

        const foundUsername = await fetch(`SELECT * FROM users WHERE username = $1;`, username)
        if (foundUsername)
            throw new UserAlreayExistsError(400, 'Username is already taken!')

        const newUser = await fetch(
            `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`,
            username,
            password
        )
        
        delete newUser.password;
        delete newUser.socket_id;

        return res.send({
            ok: true,
            user: newUser,
            token: {
                access_token: JWT.sign(newUser)
            }
        })
    } catch (error) {
        next(error)
    }
}