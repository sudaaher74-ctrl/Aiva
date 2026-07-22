const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', protect, restrictTo('Admin'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf_catalog', maxCount: 1 }]), productController.createProduct);
router.put('/:id', protect, restrictTo('Admin'), upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf_catalog', maxCount: 1 }]), productController.updateProduct);
router.delete('/:id', protect, restrictTo('Admin'), productController.deleteProduct);

module.exports = router;
