import { NextFunction, Request, Response } from "express";

export const GlobalErrors = (
    error: unknown,
    _: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(error);
    }

    if (error instanceof CustomError) {
        return res.status(error.status).json({ message: error.message });
    }

    if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal Server Error' }); 
};

export class CustomError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = "Not Found") {
        super(message, 404);
    }
}

export class BadRequestError extends CustomError {
    constructor(message: string = "Bad Request") {
        super(message, 400);
    }
}