import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Review from "../model/Review.js";
import { request } from "express";
//@desc Create new review
//@route POST /api/v1/reviews
//@access Private/Admin

export const createReviewCtrl = asyncHandler(async (req, res) => {
  const { product, message, rating } = req.body;
  //Find the product
  const { productID } = req.params;
  const productFound = await Product.findById(productID).populate("reviews");
  if (!productFound) {
    throw new Error(`Product ${productID} not found`);
  }
  //check if user already reviewed this product
  const hasReviewed = productFound?.reviews?.find((review) => {
    return review?.user?.toString() === req?.userAuthId?.toString();
  });
  if (hasReviewed) {
    throw new Error("You have already reviewed this product");
  }
  //create
  const review = await Review.create({
    message,
    rating,
    product: productFound?._id,
    user: req.userAuthId,
  });
  //Push review to product found
  productFound.reviews.push(review?._id);
  //save
  await productFound.save();
  res.status(201).json({
    success: true,
    message: "Review created successfully",
    review,
  });
});
