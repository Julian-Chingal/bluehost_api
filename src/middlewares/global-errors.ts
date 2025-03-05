import { NextFunction, Request, Response, ErrorRequestHandler } from "express";

export const GlobalErrors: ErrorRequestHandler = (
    error: unknown,
    _: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        next(error);
        return;
    }

    if (error instanceof CustomError) {
        res.status(error.status).json({ message: error.message });
        return;
    }

    if (error instanceof Error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        return;
    }

    res.status(500).json({ message: 'Internal Server Error' });
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