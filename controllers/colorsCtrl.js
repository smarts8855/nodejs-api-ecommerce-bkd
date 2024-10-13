import asyncHandler from "express-async-handler";

import Color from "../model/Colors.js";
//@desc Create new color
//@route POST /api/v1/brands
//@access Private/Admin
export const createColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //color exists
  const colorFound = await Color.findOne({ name });
  if (colorFound) {
    throw new Error(`${colorFound.name} color already exists`);
  }
  //create
  const color = await Color.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    msg: "color created successfully",
    color,
  });
});

//@desc Get all colors
//@route GET /api/v1/colors
//@access public
export const getAllColorsCtrl = asyncHandler(async (req, res) => {
  const colors = await Color.find();

  res.json({
    status: "success",
    msg: "Colors fetched successfully",
    colors,
  });
});

//@desc Get single color
//@route GET /api/v1/colors/:id
//@access public
export const getSingleColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findById(req.params.id);

  res.json({
    status: "success",
    msg: "Color fetched successfully",
    color,
  });
});

//@desc Update color
//@route  PUT/api/v1/colors/:id
//@access Private/Admin
export const updateColorCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //update
  const color = await Color.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "Color updated successfully",
    color,
  });
});

//@desc Delete color
//@route  Delete/api/v1/color/:id
//@access Private/Admin
export const deleteColorCtrl = asyncHandler(async (req, res) => {
  const color = await Color.findByIdAndDelete(req.params.id);
  if (!color) {
    throw new Error("Color not found");
  }
  res.json({
    status: "success",
    message: `${color.name} color deleted successfully`,
  });
});
