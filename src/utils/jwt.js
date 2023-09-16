import Jwt from 'jsonwebtoken';
import { TOKEN_ALGORITHM, TOKEN_SECRET_KEY, TOKEN_TIME } from '../../config.js'

export function verify(token) {
    try {
        const data = Jwt.verify(token, TOKEN_SECRET_KEY, {
            algorithms: TOKEN_ALGORITHM,
        })
        return data
    } catch (error) {
        return { error, }
    }
}


export function sign(payload) {
    try {
        const token = Jwt.sign(payload, TOKEN_SECRET_KEY, {
            expiresIn: TOKEN_TIME,
            algorithm: TOKEN_ALGORITHM
        })
        return token
    } catch (error) {
        console.error(error)
    }
}