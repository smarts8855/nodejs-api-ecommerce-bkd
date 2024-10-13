import express from "express";
import { isLoggedIn } from "../middlewares/isLogin.js";
import {
  createColorCtrl,
  deleteColorCtrl,
  getAllColorsCtrl,
  getSingleColorCtrl,
  updateColorCtrl,
} from "../controllers/colorsCtrl.js";

const colorsRouter = express.Router();

colorsRouter.post("/", isLoggedIn, createColorCtrl);
colorsRouter.get("/", getAllColorsCtrl);
colorsRouter.get("/:id", getSingleColorCtrl);
colorsRouter.put("/:id", isLoggedIn, updateColorCtrl);
colorsRouter.delete("/:id", isLoggedIn, deleteColorCtrl);

export default colorsRouter;
