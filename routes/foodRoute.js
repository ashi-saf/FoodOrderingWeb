const express = require('express');
const {
  addFood,
  listFood,
  removeFood,
} = require('../controllers/foodController.js');
const multer = require('multer');
const router = express.Router();

//image storage engine
const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, callback) => {
    return callback(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), addFood);

router.get('/list', listFood);
router.post('/remove', removeFood);

module.exports = router;
