import { Router } from 'express'
import { Authcontroller } from './auth.controller';
import { validateResource } from '../middlewares';
import { authSchema } from './auth.schema';

const router = Router();

router.post("/login", validateResource(authSchema), Authcontroller.login)
router.post("/register", validateResource(authSchema), Authcontroller.register)


export default router;