import { Router } from 'express';
import { getItems, getItem, createItem, updateItem, deleteItem } from '../controllers/item.controller';

const router = Router();

router.get('/items', getItems);
router.get('/item/:id', getItem);
router.post('/item', createItem);
router.put('/item/:id', updateItem);
router.delete('/item/:id', deleteItem);

export default router;