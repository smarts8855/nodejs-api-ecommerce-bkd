import express from "express";
import { isLoggedIn } from "../middlewares/isLogin.js";
import {
  createBrandCtrl,
  deleteBrandCtrl,
  getAllBransCtrl,
  getSingleBrandCtrl,
  updateBrandCtrl,
} from "../controllers/brandCtrl.js";

const brandsRouter = express.Router();

brandsRouter.post("/", isLoggedIn, createBrandCtrl);
brandsRouter.get("/", getAllBransCtrl);
brandsRouter.get("/:id", getSingleBrandCtrl);
brandsRouter.put("/:id", isLoggedIn, updateBrandCtrl);
brandsRouter.delete("/:id", isLoggedIn, deleteBrandCtrl);

export default brandsRouter;
