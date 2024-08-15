const userModel = require('../models/UserModel.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator');

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: ' No user found' });
    }
    const matchPwd = await bcrypt.compare(password, user.password);
    if (!matchPwd) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//creating token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};
//register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    //checking if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: 'user already exists' });
    }
    //validating email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: 'Please enter a valid email',
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: 'Please enter a strong password',
      });
    }
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashpwd = await bcrypt.hash(password, salt);
    //create new user
    const newUser = new userModel({
      name,
      email,
      password: hashpwd,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  loginUser,
  registerUser,
};
