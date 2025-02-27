import express from "express";
import { isLoggedIn } from "../middlewares/isLogin.js";
import {
  createBrandCtrl,
  deleteBrandCtrl,
  getAllBransCtrl,
  getSingleBrandCtrl,
  updateBrandCtrl,
} from "../controllers/brandCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const brandsRouter = express.Router();

// brandsRouter.post("/", isLoggedIn, isAdmin, createBrandCtrl);
brandsRouter.get("/", getAllBransCtrl);
brandsRouter.get("/:id", getSingleBrandCtrl);
brandsRouter.put("/:id", isLoggedIn, isAdmin, updateBrandCtrl);
brandsRouter.delete("/:id", isLoggedIn, isAdmin, deleteBrandCtrl);

export default brandsRouter;
