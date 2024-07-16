const Order = require("../models/orderModel")
const Product = require("../models/productModel")

//create new order
exports.newOrder = async(req, res)=>{
    const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice}= req.body

    const order = await Order.create({shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paidAt: Date.now(), user:req.user._id})

    res.status(201).json({
        success:true,
        order
    })

}

//get single order/ get order details
exports.getSingleOrder = async(req, res)=>{
    
    try {
        const order = await Order.findById(req.params.id).populate("user", "name email")
        //populate will give us name and email from UserDB instead of user id in OrderDB

        if(!order){
        return  res.status(404).json({
            success:false,
            message:"Order not found with this ID"
        })
     }

     res.status(200).json({
        success:true,
        order
     })
    
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }

}

//get loggedIn user orders
exports.myOrders = async(req, res)=>{
    
    try {
        const orders = await Order.find({user:req.user._id})

        res.status(200).json({
          success:true,
          orders
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
}

//get all orders -- Admin
exports.getAllOrders = async(req, res)=>{
    
    try {
        const orders = await Order.find()

        let totalAmount = 0;

        orders.forEach(order => {
            totalAmount += order.totalPrice
        })

        res.status(200).json({
          success:true,
          totalAmount,
          orders
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
}

//update order status -- Admin
exports.updateOrder = async(req, res)=>{
    
    try {
        const order = await Order.findById(req.params.id)

        if(!order){
            return  res.status(404).json({
                success:false,
                message:"Order not found with this ID"
            })
        }

        if(order.orderStatus === "Delivered"){
            return res.status(400).json({
                message:"You have already delivered this order"
            })
          }

          if (req.body.status === "Shipped") {
            order.orderItems.forEach(async (o) => {
              await updateStock(o.product, o.quantity);
            });
          }

        order.orderStatus = req.body.status;
        
        if(req.body.status === "Delivered"){
            order.deliveredAt = Date.now()
        }

        await order.save({validateBeforeSave: false})

        res.status(200).json({
          success:true,
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
}

async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.Stock -= quantity;
    await product.save({validateBeforeSave: false})
}

//delete order -- Admin
exports.deleteOrder = async(req, res)=>{
    
    try {
        const order = await Order.findById(req.params.id)
        if(!order){
            return  res.status(404).json({
                success:false,
                message:"Order not found with this ID"
            })
        }

        await Order.findOneAndRemove(order)

        res.status(200).json({
          success:true,
        })

    } catch (error) {
        res.status(400).json({
            success:false,
            message:error
        })
    }
}