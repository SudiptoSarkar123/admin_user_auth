const express = require('express');
const router = express.Router();
const {authCheck} = require('../middleware/authCheck');
const AdminCheck = require('../middleware/AdminCheck');
const AdminController = require('../controller/admin.controller');

router.post('/add-user',authCheck, AdminCheck, AdminController.addUser);
router.post('/create-role',authCheck, AdminController.createRole);
router.post('/add-category',AdminController.addCategory)
router.post('/add-product',AdminController.addProduct);
// router.get('/get-all-users',authCheck, AdminController.getAllUsers);
router.get('/get-allProducts-by-category', AdminController.getAllProductsByCategory);



module.exports = router;