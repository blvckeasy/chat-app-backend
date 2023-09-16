import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT || 4000
export const TOKEN_TIME = '60d'
export const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || "hello world"
export const TOKEN_ALGORITHM = process.env.TOKEN_ALGORITHM || "HS256"

export const PG_USER = process.env.PG_USER || "postgres";
export const PG_PASSWORD = process.env.PG_PASSWORD || "1029";
export const PG_DATABASE = process.env.PG_DATABASE || "chatapp";
export const PG_PORT = process.env.PG_PORT || 5432;
export const PG_HOST = process.env.PG_HOST || "localhost"


export const PAGINATION = {
  page: 1,
  limit: 5
}