const express = require('express');
const router = express.Router();

const {registerUser, 
    loginUser, 
    logout, 
    forgotPassword, 
    resetPassword,
    getUserProfie,
updatePassword, 
updateProfile, 
allUsers,
getUserDetails, updateUser, deleteUser} = 
require('../controllers/authController');

const { isAuthenticateUser, authorizedRoles} = require('../middlewares/auth')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticateUser, getUserProfie);
router.route('/password/update').put(isAuthenticateUser, updatePassword);
router.route('/me/update').put(isAuthenticateUser, updateProfile);

router.route('/admin/users').get(isAuthenticateUser, authorizedRoles('admin'), allUsers);
router.route('/admin/user/:id').get(isAuthenticateUser, authorizedRoles('admin'), getUserDetails)
router.route('/admin/user/:id').put(isAuthenticateUser, authorizedRoles('admin'), updateUser)
router.route('/admin/user/:id').delete(isAuthenticateUser, authorizedRoles('admin'), deleteUser)

module.exports = router;