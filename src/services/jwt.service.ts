import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN, REFRESH_TOKEN_EXPIRES_IN } from '../config';
import { ICreatedUser } from '../user';
import jwt from 'jsonwebtoken';

// Tipos de clave privada
type PrivateKey = 'accessTokenPrivateKey' | 'refreshTokenPrivateKey';

const setPrivateKey = (key: PrivateKey): string => {
  if (key === 'accessTokenPrivateKey') return ACCESS_TOKEN;
  return REFRESH_TOKEN;
}

// Firmar JWT
export const signJwt = (object: object, privateKey: PrivateKey, options?: jwt.SignOptions | undefined) => {
  const signInKey = Buffer.from(setPrivateKey(privateKey), 'base64').toString('ascii');

  return jwt.sign(object, signInKey, {
    ...(options && options),
    algorithm: 'HS256'
  })
};

// Verificar JWT
export const verifyJwt = <T>(token: string, keyName: PrivateKey): T | null => {
  try {
    const publicKey = Buffer.from(setPrivateKey(keyName), 'base64').toString('ascii');
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return null
  }
};

// 
export const signToken = (
  userId: ICreatedUser['UsuarioId'],
): {
  accessToken: string;
  refreshToken: string;
} => {
  const accessToken = signJwt({ sub: userId }, 'accessTokenPrivateKey', {
    expiresIn: `${ACCESS_TOKEN_EXPIRES_IN}m`
  })

  const refreshToken = signJwt({ sub: userId }, 'refreshTokenPrivateKey', {
    expiresIn: `${REFRESH_TOKEN_EXPIRES_IN}m`
  })

  return { accessToken, refreshToken }
}