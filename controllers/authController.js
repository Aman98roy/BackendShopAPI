const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/SentEmail');
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