const app = require('./app')
const connectDatabase = require('./config/database')

const dotenv = require('dotenv');

//Handle the uncaught exceptions Like Varibale a is not defined
process.on('uncaughtException', err => {
    console.log(`ERROR: ${err.message}`); //To print the complete error stack err.stack
    console.log('Shutting down due to uncaught exception');
    process.exit(1);
})

// Setting up config file
dotenv.config({path:  'config/config.env'})


//Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server started on PORT : ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})


//Handle unhandled promise rejections
process.on('unhandledRejection', err => {
    console.log(`ERROR: ${err.message}`);
    console.log('Shutting down the server due to Unhandled promise rejection');
    server.close(() => {
        process.exit(1);
    })
})