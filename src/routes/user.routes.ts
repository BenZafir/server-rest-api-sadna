import { Router } from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, promoteUser, demoteUser } from '../controllers/user.controller';

const router = Router();

router.get('/users', getUsers);
router.get('/user/:id', getUser);
router.put('/user/promote/:id', promoteUser);
router.put('/user/demote/:id', demoteUser);
router.post('/user', createUser);
router.put('/user/:id', updateUser);
router.delete('/user/:id', deleteUser);

export default router;