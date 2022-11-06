import { Router } from 'express';
import { getCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categories.controller';

const router = Router();

router.get('/categories', getCategories);
router.get('/category/:id', getCategory);
router.post('/category', createCategory);
router.put('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

export default router;