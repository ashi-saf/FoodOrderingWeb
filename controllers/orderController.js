const orderModel = require('../models/orderModel.js');
const userModel = require('../models/UserModel.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//place user order from frontend
const placeOrder = async (req, res) => {
  const frontEndUrl = 'http://localhost:5173';
  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    console.log(newOrder);
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    //payment using stripe
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },

      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Delivery Charges',
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontEndUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontEndUrl}/verify?success=false&orderId=${newOrder._id}`,
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      return res.json({ success: true, message: 'payment Successfull' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: 'payment Unsuccessfull' });
    }
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
//user order frontend
const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};
module.exports = {
  placeOrder,
  verifyOrder,
  userOrder,
  listOrders,
  updateStatus,
};
