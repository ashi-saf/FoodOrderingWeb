const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose
    .connect(
      'mongodb+srv://ashikaasikhameed:0fNNOSSNltx20iCT@cluster0.yf1ob.mongodb.net/food-del'
    )
    .then(() => {
      console.log('Database connected');
    });
};
module.exports = connectDB;
