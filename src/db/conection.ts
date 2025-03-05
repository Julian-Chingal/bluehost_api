import mysql from 'mysql'
import { dbConfig } from '../config'

// Destructuring dbConfig
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = dbConfig

// Create connection
const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectTimeout: 10000
})

// Check connection
pool.getConnection((err, conection) => {
    if (err) {
        console.log("        ➜ Database: \x1b[31mError\x1b[0m")
        throw new Error(err.message)
    }
    console.log("        ➜ Database: \x1b[32mConnected\x1b[0m")
    conection.release() 
});

// Export connection
export default pool
