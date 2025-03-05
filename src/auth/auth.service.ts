import { comparePassword, hashPassword } from '../services';
import { generateToken } from '../utils/jwt.utils';
import { CustomError, NotFoundError } from "../middlewares";
import { AuthDto, IUser } from "./auth.dto";
import pool from "../db/conection";

export class AuthService {
    static async login(body: AuthDto) {
        const user: IUser = await getUserData(body.username)

        const isPasswordValid = await comparePassword(body.password, user.Password) // Verificar contraseña
        if (!isPasswordValid) {
            throw new CustomError("Invalid password", 401);
        }

        const token = generateToken(user); // Generar token JWT
        return { Token: token };
    }

    static async register(body: AuthDto) {
        const hashedPassword = await hashPassword(body.password)
        const newUser = await createUser({ ...body, password: hashedPassword })
        const token = generateToken(newUser)
        return { ...newUser, token }
    }
}

function getUserData(username: string): Promise<IUser> {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM usuarios2 WHERE Usuario = ?`
        pool.query(query, [username], (err, result) => {
            console.log(result)
            if (err) return reject(new CustomError(err.message, 500))
            if (result.length === 0) return reject(new NotFoundError("User not found"))
            if (result[0].Estado === "Inactivo") return reject(new CustomError("User is inactive", 401))
            resolve(result[0])
        })
    })
}

function createUser(body: AuthDto): Promise<IUser> {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO usuarios2 SET ?`
        const user = { Usuario: body.username, Password: body.password, Estado: "Activo" }
        pool.query(query, user, (err) => {
            if (err) reject(new CustomError(err.message, 500))
            resolve(user)
        })
    })
}

// function insertToken(user: IUser): Promise<string> {
//     return new Promise((resolve, reject) => {
//         generateRandomToken().then(token => {
//             const tokenData = { UsuarioId: user.UsuarioId, Token: token, Estado: "Activo", Fecha: new Date() }
//             const query = `INSERT INTO usuarios_token SET ?`
//             pool.query(query, tokenData, (err) => {
//                 if (err) reject(new BadRequestError(err.message))
//                 resolve(token)
//             })
//         }).catch(err => reject(new BadRequestError(err.message)))
//     })
// }