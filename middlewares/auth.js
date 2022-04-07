const User = require('../models/user')
const jwt = require('jsonwebtoken');
const catchAsyncError  = require('./catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
//Checks if user is authenticated or not 

exports.isAuthenticateUser = catchAsyncError( async (req, res, next) => {

    const { token } = req.cookies;

    if(!token) {
        return next(new ErrorHandler('Login first to access resource', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next();
})

//Handling User roles
exports.authorizedRoles = (...roles) => { //Spread operator
    return (req, res, next) => {

        if(!roles.includes(req.user.role)) {
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access`, 
            403))
        }
        next();
    }
}