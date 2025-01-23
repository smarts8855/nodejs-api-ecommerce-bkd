import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import User from "../model/User.js";
import Order from "../model/Order.js";
import Product from "../model/Product.js";
import Coupon from "../model/Coupon.js";

//@desc Create new orders
//@route POST /api/v1/orders
//@access Private

//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

export const createOrderCtrl = asyncHandler(async (req, res) => {
  //get th coupon
  const { coupon } = req.query;

  const couponFound = await Coupon.findOne({
    code: coupon?.toUpperCase(),
  });

  if (couponFound?.isExpired) {
    throw new Error("Coupon has expired");
  }
  if (!couponFound) {
    throw new Error("Coupon not found");
  }
  //get discount
  // const discount = couponFound?.discount / 100;

  //Get the payload(customer,orderItems,shippingAddress,totalPrice)
  const { orderItems, shippingAddress, totalPrice } = req.body;
  //Find the user
  const user = await User.findById(req.userAuthId);
  //Check if user has shipping address
  if (!user?.hasShippingAddress) {
    throw new Error("Please provide shipping address");
  }
  //check if order is empty
  if (orderItems?.length <= 0) {
    throw new Error("No Order Items");
  }
  //place/create order - save into DB
  const order = await Order.create({
    user: user?._id,
    orderItems,
    shippingAddress,
    // totalPrice: couponFound ? totalPrice - totalPrice * discount : totalPrice,
    totalPrice,
  });

  //push order into user
  user.orders.push(order?._id);
  await user.save();
  //Update the product qty
  const products = await Product.find({ _id: { $in: orderItems } });
  orderItems?.map(async (order) => {
    const product = products?.find((product) => {
      return product?._id.toString() === order?._id.toString();
    });
    if (product) {
      product.totalSold += order.qty;
    }
    await product.save();
  });
  //push order into user
  user.orders.push(order?._id);
  await user.save();

  //make payment (stripe)
  //Convert order items to have same structure that stripe need
  const convertedOrders = orderItems.map((item) => {
    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item?.name,
          description: item?.description,
        },
        unit_amount: item?.price * 100,
      },
      quantity: item?.qty,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: convertedOrders,
    metadata: {
      orderId: JSON.stringify(order?._id),
    },
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.send({ url: session.url });
  //Payment webhook
  //Update the user order
  // res.json({
  //   success: true,
  //   Message: "Order created successfully",
  //   order,
  //   user,
  // });
});

//@desc Get All Orders
//@route GET /api/v1/orders
//@access Private

export const getAllOrderCtrl = asyncHandler(async (req, res) => {
  //Find all orders
  const orders = await Order.find();
  res.json({
    success: true,
    message: "All orders found",
    orders,
  });
});

//@desc Get Single Orders
//@route GET /api/v1/orders/:id
//@access Private

export const getSingleOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from params
  const id = req.params.id;
  const order = await Order.findById(id);
  //send response
  res.status(200).json({
    success: true,
    message: "Single order found",
    order,
  });
});

//@desc Update Order
//@route PUT/api/v1/orders/update/:id
//@access Private/admin

export const updateOrderCtrl = asyncHandler(async (req, res) => {
  //get the id from the params
  const id = req.params.id;
  //update
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    message: "Order updated successfully",
    updatedOrder,
  });
});

//@desc get sales sum of orders
//@route GET /api/v1/orders/sales/sum
//@access Private/admin

export const getOrderStatsCtrl = asyncHandler(async (req, res) => {
  //get order stats
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        minimumSales: {
          $min: "$totalPrice",
        },
        totalSales: {
          $sum: "$totalPrice",
        },
        maxSales: {
          $max: "$totalPrice",
        },
        avgSale: {
          $avg: "$totalPrice",
        },
      },
    },
  ]);
  //get the date
  const date = new Date();
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const saleToday = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalSales: {
          $sum: "$totalPrice",
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Sum of orders",
    orders,
    saleToday,
  });
});
