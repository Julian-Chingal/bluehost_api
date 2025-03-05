/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { CustomError } from '../middlewares';
import { IUser } from '../auth/auth.dto';

export const generateToken = (user: IUser): string => {
  const payload = { usuarioId: user.UsuarioId, Usuario: user.Usuario };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new CustomError('Invalid or expired token', 401);
  }
};