const express = require('express')
const router = express.Router();


const {getProducts, newProduct, getAllProducts, singleProdcut, updateProduct, deleteProduct} = require('../controllers/productController')

const { isAuthenticateUser, authorizedRoles} = require('../middlewares/auth');

//router.route('/products').get(isAuthenticateUser, getProducts);

router.route('/products').get(getProducts);//Just for demo not cooneted with database

router.route('/admin/product/new').post(isAuthenticateUser, authorizedRoles('admin', 'user'), newProduct);

router.route('/allProducts').get(getAllProducts);

router.route('/product/:id').get(singleProdcut);

router.route('/admin/product/:id').put(isAuthenticateUser, authorizedRoles('admin'), updateProduct);

router.route('/admin/product/:id').delete(isAuthenticateUser, authorizedRoles('admin'), deleteProduct);


module.exports = router;