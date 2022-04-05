//Error Handler class for error

class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor); //this is called the local varible, constructor of this object pass the 
    }
} 

module.exports = ErrorHandler;