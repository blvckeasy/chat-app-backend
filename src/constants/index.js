import DotEnv from 'dotenv';
DotEnv.config()


export const JWT_CONFIG = {
    secketKey: process.env.JWT_TOKEN_SECRET_KEY,
    algorithm: process.env.JWT_TOKEN_ALGORITHM,
    accessTokenExpiresIn: 7 * 24 * 60 * 60,         // 7 kun intervali
}