import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../constants/index.js';
import { TokenError } from '../errors/jwt.error.js'

export class JWT {

    static async sign (payload) {
        const token = jwt.sign(payload, JWT_CONFIG.secketKey, {
            algorithm: JWT_CONFIG.algorithm,
            expiresIn: JWT_CONFIG.accessTokenExpiresIn
        })

        return token;
    }

    static async verify (token) {
        try {
            const payload = jwt.verify(token, JWT_CONFIG.secketKey, {
                algorithms: JWT_CONFIG.algorithm
            });
            return payload;
        } catch (error) {
            throw new TokenError("Token eskirgan!");
        }
    }
}