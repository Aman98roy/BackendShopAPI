const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    //err.message = err.message || 'internal server error';

    if(process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errMessage: err.message,
            stack:err.stack
        })
    }

    if(process.env.NODE_ENV === 'PRODUCTION') {
        let error = {...err}  //copy of the error

        error.message = err.message

        //Wrong monggose object ID Error
        if(err.name == 'CastError') {
            const message = `Resource not found Invalid: ${err.path}`
            error = new ErrorHandler(message, 400);
        }

        //Handling Monggose validation ErrorHandler
        if(err.name === 'validationError') {
            const message = object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        })
    }

}