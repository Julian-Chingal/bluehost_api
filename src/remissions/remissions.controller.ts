import { RemissionService } from './remissions.services';
import { Request, Response, NextFunction } from 'express';

export class RemissionController {
    static async get(req: Request, res: Response, next: NextFunction) {
        try {
            const remissions = await RemissionService.getRemissions();
            res.send(remissions).status(200);
        } catch (error) {
            next(error);
        }
    }

    static async getByNumber(req: Request, res: Response, next: NextFunction) {
        try {
            const { remissionNumber } = req.params;
            console.log(remissionNumber);
            const remission = await RemissionService.getRemissionByNumber(remissionNumber);
            res.send(remission).status(200);
        } catch (error) {
            next(error);
        }
    }

    static async getByEntryDate(req: Request, res: Response, next: NextFunction) {
        try {
            const { remissionNumber } = req.params;
            const remission = await RemissionService.getDateByRemissionNumber(remissionNumber);
            res.send(remission).status(200);
        } catch (error) {
            next(error);
        }
    }

    static async getByExitDate(req: Request, res: Response, next: NextFunction) {
        try {
            const { remissionNumber } = req.params;
            const remission = await RemissionService.getDateByRemissionNumber(remissionNumber);
            res.send(remission).status(200);
        } catch (error) {
            next(error);
        }
    }

    static async put(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req;
            const remission = await RemissionService.updateRemission(body);
            res.send(remission).status(200);
        } catch (error) {
            next(error);
        }
    }
}