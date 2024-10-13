import express from "express";
import {
  createProduct,
  getProductsCtrl,
  getProductCtrl,
  updateProductCtrl,
  deleteProductCtrl,
} from "../controllers/productCtrl.js";
import { isLoggedIn } from "../middlewares/isLogin.js";

const productRouter = express.Router();

productRouter.post("/", isLoggedIn, createProduct);
productRouter.get("/", getProductsCtrl);
productRouter.get("/:id", getProductCtrl);
productRouter.put("/:id", isLoggedIn, updateProductCtrl);
productRouter.delete("/:id", isLoggedIn, deleteProductCtrl);

export default productRouter;
