import express from "express";
import { isLoggedIn } from "../middlewares/isLogin.js";
import {
  createCategoryCtrl,
  deleteCategoryCtrl,
  getAllCategoriesCtrl,
  getSingleCategoryCtrl,
  updateCategoryCtrl,
} from "../controllers/categoriesCtrl.js";
import upload from "../config/fileUpload.js";
import isAdmin from "../middlewares/isAdmin.js";

const categoriesRouter = express.Router();

categoriesRouter.post(
  "/",
  isLoggedIn,
  isAdmin,
  upload.single("file"),
  createCategoryCtrl
);
categoriesRouter.get("/", getAllCategoriesCtrl);
categoriesRouter.get("/:id", getSingleCategoryCtrl);
categoriesRouter.put("/:id", isLoggedIn, isAdmin, updateCategoryCtrl);
categoriesRouter.delete("/:id", isLoggedIn, isAdmin, deleteCategoryCtrl);

export default categoriesRouter;
