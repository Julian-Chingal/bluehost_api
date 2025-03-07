import { findUniqueUserByUsername, ICreateUser, ICreatedUser  } from '../user';
import { comparePassword, hashPassword } from '../services';
import { CustomError } from "../middlewares";
import { signToken } from '../services/jwt.service';
import { AuthInput } from './auth.schema';
import { Pool } from "../config";

export class AuthService {
    static async login(body: AuthInput['body']) {
        const user: ICreatedUser = await findUniqueUserByUsername(body.username)

        const isPasswordValid = await comparePassword(body.password, user.Password) // Verificar contraseña
        if (!isPasswordValid) {
            throw new CustomError("Invalid password", 401);
        }

        const token = signToken(user.UsuarioId); // Generar token JWT
        return { ...token };
    }

    static async register(body: AuthInput['body']) {
        const hashedPassword = await hashPassword(body.password)
        const newUser = await createUser({ ...body, password: hashedPassword })
        return { ...newUser, password: "" }
    }
}

function createUser(body: AuthInput['body']): Promise<ICreateUser> {
    return new Promise((resolve, reject) => {
        const query = `INSERT INTO usuarios2 SET ?`
        const user = { Usuario: body.username, Password: body.password, Estado: "Activo" }
        Pool.query(query, user, (err) => {
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
//             Pool.query(query, tokenData, (err) => {
//                 if (err) reject(new BadRequestError(err.message))
//                 resolve(token)
//             })
//         }).catch(err => reject(new BadRequestError(err.message)))
//     })
// }