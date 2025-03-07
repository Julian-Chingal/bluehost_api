import { Request, Response, NextFunction } from 'express';
import { CustomError } from './global-errors';
import { verifyJwt } from '../services';
import { findUniqueUser } from '../user';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    try {
        let access_token

        // Check if token is in headers or cookies
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            access_token = req.headers.authorization.split(' ')[1]
        } else if (req.cookies?.access_token) {
            access_token = req.cookies.access_token
        }

        // If no token is found, return an error
        if (!access_token) {
            return next( new CustomError('No token provided', 401))
        }

        // Verify token
        const decoded = verifyJwt<{ sub: string}>(access_token, 'accessTokenPrivateKey')
        if (!decoded) {
            return next( new CustomError('Invalid token', 401))
        }

        // Find user
        const user = await findUniqueUser(parseInt(decoded.sub))
        
        res.locals.user = {
            id: user.UsuarioId,
            username: user.Usuario,
            Estado: user.Estado
        }

        next()
    } catch (err) {
        next(err);
    }
}