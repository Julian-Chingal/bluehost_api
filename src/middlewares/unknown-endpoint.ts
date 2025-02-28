import { Request, Response } from 'express';

export const unknowEndpoint = (_: Request, res: Response) => {
  res.status(404).send({ message: 'Not found' });
};