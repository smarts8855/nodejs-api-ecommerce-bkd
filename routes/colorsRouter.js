import express from "express";
import { isLoggedIn } from "../middlewares/isLogin.js";
import {
  createColorCtrl,
  deleteColorCtrl,
  getAllColorsCtrl,
  getSingleColorCtrl,
  updateColorCtrl,
} from "../controllers/colorsCtrl.js";
import isAdmin from "../middlewares/isAdmin.js";

const colorsRouter = express.Router();

colorsRouter.post("/", isLoggedIn, isAdmin, createColorCtrl);
colorsRouter.get("/", getAllColorsCtrl);
colorsRouter.get("/:id", getSingleColorCtrl);
colorsRouter.put("/:id", isLoggedIn, isAdmin, updateColorCtrl);
colorsRouter.delete("/:id", isLoggedIn, isAdmin, deleteColorCtrl);

export default colorsRouter;
