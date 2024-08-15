const userModel = require('../models/UserModel.js');

//add items to cart
const addtoCart = async (req, res) => {
  try {
    console.log('Received request:', req.body);
    let userData = await userModel.findById(req.body.userId);
    console.log('User data retrieved:', userData);
    let cartData = userData.cartData;
    console.log('Initial cart data:', cartData);
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    console.log('Updated cart data:', cartData);
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    return res.json({ success: true, message: 'Added To Cart' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//remove items from cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    return res.json({ success: true, message: 'Removed From Cart' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//fetch userCart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData;
    return res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  addtoCart,
  removeFromCart,
  getCart,
};
