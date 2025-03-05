import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";


export class Authcontroller {
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req;
            const user = await AuthService.login(body);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    static async register(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req;
            const user = await AuthService.register(body);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }
}