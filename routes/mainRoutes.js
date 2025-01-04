
const express = require('express');
const { connectRoot } = require('../config/connectDB');
const productController = require('../controllers/productController');
const userController = require('../controllers/userController');

const router = express.Router();

(async () => {
    const pool = await connectRoot();

    // Gọi các hàm từ productController
    router.get('/api/get-all-product', (req, res) => productController.getAllProductsFromService(pool, req, res));
    router.post('/api/add-product', (req, res) => productController.addProductFromService(pool, req, res));
    router.delete('/api/delete-product', (req, res) => productController.deleteProductFromService(pool, req, res));
    router.put('/api/edit-product', (req, res) => productController.updateInforProduct(pool, req, res));

    // Gọi các hàm từ userController
    router.get('/api/get-all-user', (req, res) => userController.getAllUsers(pool, req, res));
    router.post('/api/add-user', (req, res) => userController.addNewUser(pool, req, res));
    router.delete('/api/delete-user', (req, res) => userController.deleteUserFromService(pool, req, res));
    router.put('/api/edit-user', (req, res) => userController.updateInforUser(pool, req, res));


})();

module.exports = router;
