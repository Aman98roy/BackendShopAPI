const express = require('express');
const router = express.Router();

const { newOrder, 
getSingleOrder, myOrders, allOrders, updateOrder } = require('../controllers/orderController');

const { isAuthenticateUser, authorizedRoles } = 
require('../middlewares/auth');

router.route('/order/new').post(isAuthenticateUser, newOrder);
router.route('/order/:id').get(isAuthenticateUser, getSingleOrder);
router.route('/orders/me').get(isAuthenticateUser, myOrders);
router.route('admin/orders').get(isAuthenticateUser, authorizedRoles('admin'), allOrders);
router.route('admin/order/:id').put(isAuthenticateUser, authorizedRoles('admin'), updateOrder);


module.exports = router;