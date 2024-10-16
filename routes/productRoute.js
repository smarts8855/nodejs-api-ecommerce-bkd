import express from "express";
import {
  createProduct,
  getProductsCtrl,
  getProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} from "../controllers/productCtrl.js";
import { isLoggedIn } from "../middlewares/isLogin.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.array("files"),
  createProduct
);
productRouter.get("/", getProductsCtrl);
productRouter.get("/:id", getProductCtrl);
productRouter.put("/:id", isLoggedIn, isAdmin, updateProductCtrl);
productRouter.delete("/:id", isLoggedIn, isAdmin, deleteProductCtrl);

export default productRouter;
