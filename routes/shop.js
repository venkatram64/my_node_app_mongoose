const path = require('path');
const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

const Product = require('../models/product');

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.post('/cart', shopController.postCart);

router.get('/cart', shopController.getCart);

router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

module.exports = router;