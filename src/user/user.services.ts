import { Pool } from "../config"
import { ICreatedUser, IUser } from "."
import { CustomError, NotFoundError } from "../middlewares"

export const findUniqueUser = (id: number): Promise<IUser> => {
    return new Promise((resolve, reject) => {
        const query = `SELECT UsuarioId, Usuario, Estado FROM usuarios2 WHERE UsuarioId = ?`
        Pool.query(query, [id], (err, result) => {
            if (err) return reject(new CustomError(err.message, 500))
            if (result.length === 0) return reject(new NotFoundError("User not found"))
            if (result[0].Estado === "Inactivo") return reject(new CustomError("User is inactive", 401))
            resolve(result[0])
        })
    })
}

export const findUniqueUserByUsername = (username: string): Promise<ICreatedUser> => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM usuarios2 WHERE Usuario = ?`
        Pool.query(query, [username], (err, result) => {
            if (err) return reject(new CustomError(err.message, 500))
            if (result.length === 0) return reject(new NotFoundError("User not found"))
            if (result[0].Estado === "Inactivo") return reject(new CustomError("User is inactive", 401))
            resolve(result[0])
        })
    })
}