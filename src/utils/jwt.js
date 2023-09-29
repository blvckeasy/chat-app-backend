import Jwt from 'jsonwebtoken';
import { TOKEN_ALGORITHM, TOKEN_SECRET_KEY, TOKEN_TIME } from '../../config.js'
import { TokenIsInvalid } from './error.js'


export default class JWT {
    static verify(token) {
        try {
            const data = Jwt.verify(token, TOKEN_SECRET_KEY, {
                algorithms: TOKEN_ALGORITHM,
            })
            return data
        } catch (error) {
            throw new TokenIsInvalid("Token is expired!");
        }
    }
    
    
    static sign(payload) {
        const token = Jwt.sign(payload, TOKEN_SECRET_KEY, {
            expiresIn: TOKEN_TIME,
            algorithm: TOKEN_ALGORITHM
        })
        return token
    }
}
