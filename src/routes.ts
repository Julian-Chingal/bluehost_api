import { Router } from 'express'
import authRouter from './auth/auth.routes';
import remisionesRouter from './remissions/remissions.routes'

const router = Router();

router.use('/auth', authRouter);
router.use('/remissions', remisionesRouter);

export default router;