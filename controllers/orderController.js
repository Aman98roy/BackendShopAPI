const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors  = require('../middlewares/catchAsyncErrors');

//Create a new Order  => api/v1/order/new
exports.newOrder = catchAsyncErrors( async (req, res, next) => {

    const {
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    console.log(req.body);

    //const order = Order.create(req.body);

    const order = await Order.create({ 
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
     })

     console.log("sdcds", order);
     

     res.status(200).json({
         success: true,
         order
     })
})

//Get single order => /api/v1/order/:id 
exports.getSingleOrder = catchAsyncErrors( async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(!order) {
        return next(new ErrorHandler('No order found with this ID', 404));
    }

    res.status(200).json({
        success: true,
        order
    })
})

//Get logged in user orders  => api/v1/orders/me
exports.myOrders = catchAsyncErrors( async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id});

    res.status(200).json({
        success: true,
        orders
    })
})

//Get all orders  ADMIN => api/v1/admin/orders
exports.allOrders = catchAsyncErrors( async (req, res, next) => {
    const orders = await Order.find();

    let totalAmt = 0;
    orders.forEach(order => {
        totalAmt +=  order.totalPrice
    })

    res.status(200).json({
        success: true,
        totalAmt,
        orders
    })
})

//Update / process order  ADMIN => api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors( async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === 'Deliverd') {
        return next(new ErrorHandler('You have already delivered this order', 404));
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true,
    })

    async function updateStock(id, quantity) {
        const product = await Product.findById(id);

        product.stock = product.stock - quantity;

        await product.save();
    }
})