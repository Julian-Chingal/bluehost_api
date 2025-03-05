import 'dotenv/config'

export const SALT = process.env.SALT || "salt"

export const JWT_SECRET = process.env.JWT_SECRET || "Prueba_jwt"

export const PORT =  process.env.PORT || 3000

export const dbConfig = {
    DB_NAME: process.env.DB_NAME || "remissions",
    DB_USER: process.env.DB_USER || "root",
    DB_PASSWORD: process.env.DB_PASS || "",
    DB_HOST: process.env.DB_HOST || "localhost",
}