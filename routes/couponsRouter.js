import express from "express";
import { isLoggedIn } from "../middlewares/isLogin.js";
import { createCouponCtrl } from "../controllers/couponCtrl.js";

const couponRouter = express.Router();

couponRouter.post("/", isLoggedIn, createCouponCtrl);

export default couponRouter;
