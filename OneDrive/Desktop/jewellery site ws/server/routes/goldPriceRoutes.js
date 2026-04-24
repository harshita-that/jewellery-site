import express from 'express';
import { getGoldPrice, updateGoldPrice } from '../controllers/goldPriceController.js';

const router = express.Router();

router.get('/', getGoldPrice);
router.put('/', updateGoldPrice);

export default router;
