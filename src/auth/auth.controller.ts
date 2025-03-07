import { Request, Response, NextFunction, CookieOptions } from "express";
import { AuthService } from "./auth.service";
import { AuthInput } from "./auth.schema";
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../config";

// Cookies options
const cookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
}

// Access token options
const accessTokenOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(Date.now() + ACCESS_TOKEN_EXPIRES_IN * 60 * 1000),
    maxAge: ACCESS_TOKEN_EXPIRES_IN * 60 * 1000,
}

// Refresh token options
const refreshTokenOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN * 60 * 1000),
    maxAge:  REFRESH_TOKEN_EXPIRES_IN * 60 * 1000,
}

export class Authcontroller {
    static async login(req: Request<object, object, AuthInput['body']>, res: Response, next: NextFunction) {
        try {
            const { body } = req;
            const { accessToken, refreshToken} = await AuthService.login(body);
            
            res.cookie('access_token', accessToken, accessTokenOptions)
            res.cookie('refresh_token', refreshToken, refreshTokenOptions)
            
            res.status(200).json({accessToken, refreshToken});
        } catch (error) {
            next(error);
        }
    }

    static async register(req: Request<object, object, AuthInput["body"]>, res: Response, next: NextFunction) {
        try {
            const { body } = req;
            const user = await AuthService.register(body);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }
}