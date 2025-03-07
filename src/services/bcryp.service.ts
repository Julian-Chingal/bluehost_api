import crypto from 'crypto'
import { SALT } from '../config'

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    const hashVerify = crypto
        .pbkdf2Sync(password, SALT, 1000, 64, `sha512`)
        .toString(`hex`);
    return hash === hashVerify
}

export const hashPassword = async (password: string): Promise<string> => {
    const hash = crypto
        .pbkdf2Sync(password, SALT, 1000, 64, `sha512`)
        .toString(`hex`);
    return hash
}