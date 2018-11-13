const express = require('express');
const multer = require('multer');
const checkAuth = require('../middleware/auth');
const router = express.Router();

const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer(
  {
    storage: storage, 
    limits: {
      fileSize: 1024 * 1024 * 20
    },
    fileFilter
  }
);

router.get('/', ProductsController.products_get_all);
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_get_all);
router.get('/:productId', ProductsController.products_get_by_id);
router.patch('/:productId', checkAuth, ProductsController.products_edit);
router.delete('/:productId', checkAuth, ProductsController.products_delete);

module.exports = router;