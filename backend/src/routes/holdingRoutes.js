import express from 'express';
import * as holdingController from '../controllers/holdingController.js';
import protect from '../middleware/protect.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Holdings routes
router.post('/', holdingController.addHolding);
router.get('/', holdingController.getHoldings);
router.get('/:id', holdingController.getHoldingById);
router.put('/:id', holdingController.updateHolding);
router.delete('/:id', holdingController.deleteHolding);

export default router;
