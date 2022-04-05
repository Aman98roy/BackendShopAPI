const Product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');

//setting dotenv file 

dotenv.config({ path: 'backend/config/config.env'})

connectDatabase();

const seedProduct = async () => {
    try {

        await Product.deleteMany();
        console.log('Products deleted successfully')

        await Product.insertMany(products);
        console.log('All products are added');

        process.exit();

    }catch(err) {
        console.log(err.message);
        process.exit();
    }
}

seedProduct();