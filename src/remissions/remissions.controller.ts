import { RemissionService } from './remissions.service';
import { Request, Response, NextFunction } from 'express';

export class RemissionController {
    static async get(_: Request, res: Response, next: NextFunction) {
        try {
            const remissions = await RemissionService.getRemissions();
            res.status(200).send(remissions);
        } catch (error) {
            next(error);
        }
    }

    static async getByNumber(req: Request, res: Response, next: NextFunction) {
        try {
            const { remissionNumber } = req.params;
            const remission = await RemissionService.getRemissionByNumber(remissionNumber);
            res.status(200).send(remission);
        } catch (error) {
            next(error);
        }
    }

    static async getByEntryDate(req: Request, res: Response, next: NextFunction) {
        try {
            const { remissionNumber } = req.params;
            const remission = await RemissionService.getDateByRemissionNumber(remissionNumber);
            res.status(200).send(remission)
        } catch (error) {
            next(error);
        }
    }

    static async getByExitDate(req: Request, res: Response, next: NextFunction) {
        try {
            const { remissionNumber } = req.params;
            const remission = await RemissionService.getDateByRemissionNumber(remissionNumber);
            res.status(200).send(remission)
        } catch (error) {
            next(error);
        }
    }

    static async put(req: Request, res: Response, next: NextFunction) {
        try {
            const { body } = req;
            const remission = await RemissionService.updateRemission(body);
            res.status(202).json(remission)
        } catch (error) {
            next(error);
        }
    }
}