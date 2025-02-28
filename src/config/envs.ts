import 'dotenv/config'

export const config = {
    PORT: process.env.PORT || 3000,
}

export const dbConfig = {
    DB_NAME: process.env.DB_NAME || "remissions",
    DB_USER: process.env.DB_USER || "root",
    DB_PASSWORD: process.env.DB_PASS || "",
    DB_HOST: process.env.DB_HOST || "localhost",
}