const express = require('express');
const router = express.Router();
const {authCheck} = require('../middleware/authCheck');
const AdminCheck = require('../middleware/AdminCheck');
const AdminController = require('../controller/admin.controller');

router.post('/add-user', AdminController.addUser);
router.post('/login', AdminController.login);
router.post('/create-role',authCheck, AdminController.createRole);
router.post('/add-category',authCheck,AdminCheck,AdminController.addCategory)
router.post('/add-product',authCheck,AdminCheck, AdminController.addProduct);
router.get('/get-allProducts-by-category', AdminController.getAllProductsCountByCategoryAndSubCategory);
router.get('/get-all-users', AdminController.getAllUsers);



module.exports = router;