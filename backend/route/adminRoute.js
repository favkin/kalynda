import express from 'express';
import { register, login } from '../controller/adminController.js';

const router = express.Router();

import { roleMiddileware } from '../middleware/role.js';
import { authMiddleware } from '../middleware/auth.js';

router.post('/register', /*authMiddleware,*/ roleMiddileware('admin'), register);
router.post('/login', /*authMiddleware,*/ roleMiddileware('admin'), login);

export default router;