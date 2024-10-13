import dotenv from "dotenv";
import Stripe from "stripe";
dotenv.config();
import express from "express";
import dbConnect from "../config/dbConnect.js";
import userRoutes from "../routes/usersRoute.js";
import { globalErrHandler, notFound } from "../middlewares/globalErrHandler.js";
import productRouter from "../routes/productRoute.js";
import categoriesRouter from "../routes/categoriesRouter.js";
import brandsRouter from "../routes/brandsRouter.js";
import colorsRouter from "../routes/colorsRouter.js";
import reviewRouter from "../routes/reviewsRouter.js";
import ordersRouter from "../routes/ordersRouter.js";
import Order from "../model/Order.js";
import couponRouter from "../routes/couponsRouter.js";
//db connect
dbConnect();

const app = express();
//Stripe webhook
//stripe instance
const stripe = new Stripe(process.env.STRIPE_KEY);

//This is your Stripe CLI webhook secret key for testing your endpoint locally
const endpointSecret = process.env.WEBHOOK_SECRET_KEY;

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      // console.log(event);
    } catch (err) {
      // console.log("err", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "checkout.session.completed") {
      //update the order
      const session = event.data.object;

      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const currency = session.currency;
      //find the order
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          totalPrice: totalAmount / 100,
          currency: currency,
          paymentMethod: paymentMethod,
          paymentStatus: paymentStatus,
        },
        { new: true }
      );
      // console.log(order);
    } else {
      return;
    }
    //Handle the event
    // switch (event.type) {
    //   case "payment_intent.succeeded":
    //     const paymentIntent = event.data.object;
    //     //The define and call a function to handle the event payment_intent.succeeded
    //     break;
    //   // ... handle other event types
    //   default:
    //     console.log(`Unhandled event type ${event.type}`);
    // }
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);
//pass incoming data
app.use(express.json());

//routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/brands", brandsRouter);
app.use("/api/v1/colors", colorsRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/coupons", couponRouter);

//err middleware
app.use(notFound);
app.use(globalErrHandler);
export default app;
