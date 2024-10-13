import express from "express";
import { isLoggedIn } from "../middlewares/isLogin.js";
import {
  createOrderCtrl,
  getAllOrderCtrl,
  getSingleOrderCtrl,
  updateOrderCtrl,
} from "../controllers/orderCtrl.js";

const ordersRouter = express.Router();

ordersRouter.post("/", isLoggedIn, createOrderCtrl);
ordersRouter.get("/", isLoggedIn, getAllOrderCtrl);
ordersRouter.get("/:id", isLoggedIn, getSingleOrderCtrl);
ordersRouter.put("/update/:id", isLoggedIn, updateOrderCtrl);
// ordersRouter.get("/", getAllBransCtrl);
// ordersRouter.get("/:id", getSingleBrandCtrl);
// ordersRouter.put("/:id", isLoggedIn, updateBrandCtrl);
// ordersRouter.delete("/:id", isLoggedIn, deleteBrandCtrl);

export default ordersRouter;
