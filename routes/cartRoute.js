const express = require('express');
const router = express.Router();
const {
  addtoCart,
  getCart,
  removeFromCart,
} = require('../controllers/CartController.js');
const authMiddleware = require('../middleware/auth.js');

router.post('/get', authMiddleware, getCart);
router.post('/add', authMiddleware, addtoCart);
router.post('/remove', authMiddleware, removeFromCart);
module.exports = router;
