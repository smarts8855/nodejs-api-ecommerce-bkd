import express from "express";
import { isLoggedIn } from "../middlewares/isLogin.js";
import { createReviewCtrl } from "../controllers/reviewsCtrl.js";

const reviewRouter = express.Router();

reviewRouter.post("/:productID", isLoggedIn, createReviewCtrl);

export default reviewRouter;
