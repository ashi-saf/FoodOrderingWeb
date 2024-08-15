const express = require('express');
const router = express.Router();
const {
  placeOrder,
  verifyOrder,
  userOrder,
  listOrders,
  updateStatus,
} = require('../controllers/orderController.js');
const authMiddleware = require('../middleware/auth.js');

router.post('/place', authMiddleware, placeOrder);
router.post('/verify', verifyOrder);
router.post('/userorder', authMiddleware, userOrder);
router.get('/list', listOrders);
router.post('/status', updateStatus);
module.exports = router;
