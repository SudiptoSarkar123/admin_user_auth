const express = require('express');
const router = express.Router();
const {authCheck} = require('../middleware/authCheck');
const AdminController = require('../controller/admin.controller');

router.get('/get-allProducts-by-category',authCheck, AdminController.getAllProductsCountByCategoryAndSubCategory);



module.exports = router;