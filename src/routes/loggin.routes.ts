import { Router } from 'express';
import { loggin } from '../controllers/loggin.controller';

const router = Router();

router.post('/loggin', loggin);

export default router;