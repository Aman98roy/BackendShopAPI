const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/SentEmail');

const crypto = require('crypto');
const { send } = require('process');
//Register a user => /api/v1/registeredUser
exports.registerUser = catchAsyncErrors( async (req, res, next) => {

    const {name, email, password} = req.body;

    const user =await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'ayan/ee',
            url: 'https://api.twitter.com/'
        }
    })

    sendToken(user, 200, res)
})

//Login User => /a[i/v1/login]

exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const {email, password} = req.body;

    //Checks if email and password is entered by user

    if(!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    //Finding user in database
    const user = await User.findOne({email}).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    //Checks i password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user, 200, res)
})

//Forgot Password = > /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email});

    if(!user) {
        return next(new ErrorHandler('User is not found', 404));
    }

    //Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false})

    //Create reset password useNewUrlParser
    const reserUrl = `${req.protocol}://${req.get('host')}/api/v1/password//reset/${resetToken}`

    const message = `Your password reset token is as follow:\n\n${reserUrl}\n\n if you have not 
    requested this email, then ignore it`

    try {

        await sendEmail({
            email: user.email, 
            subject: 'ShopIt password RECOVERY', 
            message
        })

        res.status(200).json({
            success:true,
            message: `email sent to ${user.email}`
        })


    }catch(error) {
        user.reserPasswordToken = undefined;
        user.reserPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500))

    }
})


//Logout user  => /api/v1/Logout
exports.logout = catchAsyncErrors( async (req, res, next) => {
    res.cookie('token', null, { 
        expires: new Date(Date.now()),
        httpOnly: true

    })

    res.status(200).json({
        success: true,
        message:'Logged out'
    })
})

//Reset Password = > /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors( async (req, res, next) => {

    //Hash the URL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).
    digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now() }
    })

    if(!user) {
        return next(new ErrorHandler('Password reset token is Invalid or has been expired', 400));
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }

    //Setup new Password
    user.password = req.body.password;

    user.reserPasswordToken = undefined;
    user.reserPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)

})

//Get currently logged in user details => /api/v1/me 
exports.getUserProfie = catchAsyncErrors( async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//Update / Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors( async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password');

    //check previous user password
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched) {
        return next(new ErrorHandler('Old password is incorrect', 400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res);
})

//Update user profile = > /api/v1/me/update

exports.updateProfile = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }

    //Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, { 
        new: true,
        runValidators: true,
        userFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    })
})

//Admin Routes

//Get all users =>/api/v1/admin/users
exports.allUsers = catchAsyncErrors( async (req, res, next) => {
    const user = await User.find();
    
    res.status(200).json({
        success: true,
        user
    })
})

//Get user details => /api/v1/admin/users/:id
exports.getUserDetails = catchAsyncErrors( async (req, res, next) =>{
    const user = await User.findById(req.user.id);

    if(!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`));
    }
    
    res.status(200).json({
        success: true,
        user
    })
})

//Update User profile =>  /api/v1//admin/user/:id
exports.updateUser = catchAsyncErrors( async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    //Update avatar: TODO

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, { 
        new: true,
        runValidators: true,
        userFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    })
})

//Get user details => /api/v1/admin/users/:id
exports.deleteUser = catchAsyncErrors( async (req, res, next) =>{
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new ErrorHandler(`User does not found with id: ${req.params.id}`));
    }
    
    //Remove avatar fro cloudnary --   todo

    await user.remove();

    res.status(200).json({
        success: true,
    })
})