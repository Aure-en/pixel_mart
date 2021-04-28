const multer = require('multer');
const path = require('path');

// Set up destination
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../images'));
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `item-${req.params.id}-${Date.now()}.${ext}`);
  },
});

// Check if the file is actually an image
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload an image.'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}).single('image');

module.exports = upload;
