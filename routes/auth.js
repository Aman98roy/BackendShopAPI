const express = require('express');
const router = express.Router();

const {registerUser, 
    loginUser, 
    logout, 
    forgotPassword, 
    resetPassword,
    getUserProfie,
updatePassword, 
updateProfile} = 
require('../controllers/authController');

const { isAuthenticateUser } = require('../middlewares/auth')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword)

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticateUser, getUserProfie);
router.route('/password/update').put(isAuthenticateUser, updatePassword);
router.route('/me/update').put(isAuthenticateUser, updateProfile);

module.exports = router;