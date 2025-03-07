import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from '.'
import mysql from 'mysql'

/**
 * Create a connection pool to the database
 */
export const Pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectTimeout: 10000
})

/**
 * Check if the connection to the database was successful
 */
Pool.getConnection((err, conection) => {
    if (err) {
        console.log("        ➜ Database: \x1b[31mError\x1b[0m")
        throw new Error(err.message)
    }
    console.log("        ➜ Database: \x1b[32mConnected\x1b[0m")
    conection.release() 
});