const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');

const catchAsyncErrors  = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/apiFeatures');


//create new product  => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors (async (req, res, next) => {
    
    req.body.user = req.user.id;
    
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

//Get all products => /api/v1//allProducts

exports.getAllProducts = async (req, res, next) => {

    const resPerPage = 4;
    const productCount = await Product.countDocuments();


    const apiFeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })

}
//Get single product details => /api/v1/product/:id
exports.singleProdcut = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
        
    }

    res.status(200).json({
        success: true,
        product
    })
}


exports.getProducts = (req,res,next) => {
    res.status(200).json({
        success: true,
        message: 'This route will show all the product in databease' 

    })
}

//Update Product => /api/v1/admin/product:id

exports.updateProduct = async (req, res, next) => {

    let product = await Product.findById(req.params.id);

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        userFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product
    })
}

//Delete a product => /api/v1/admin.product/:id

exports.deleteProduct = async (req, res, next) => {

    const product = await(Product.findById(req.params.id));

    if(!product) {
        return next(new ErrorHandler('Product not found', 404));
    }
    
    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted'
    });
}