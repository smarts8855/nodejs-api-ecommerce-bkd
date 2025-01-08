import asyncHandler from "express-async-handler";
import Brand from "../model/Brand.js";
//@desc Create new brand
//@route POST /api/v1/brands
//@access Private/Admin
export const createBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //brand exists
  const brandFound = await Brand.findOne({ name: name?.toLowerCase() });
  if (brandFound) {
    throw new Error(`${brandFound.name} brand already exists`);
  }
  //create
  const brand = await Brand.create({
    name: name.toLowerCase(),
    user: req.userAuthId,
  });
  res.json({
    status: "success",
    msg: "brand created successfully",
    brand,
  });
});

//@desc Get all brands
//@route GET /api/v1/brands
//@access public
export const getAllBransCtrl = asyncHandler(async (req, res) => {
  const brands = await Brand.find();

  res.json({
    status: "success",
    msg: "Brands fetched successfully",
    brands,
  });
});

//@desc Get single brand
//@route GET /api/v1/brands/:id
//@access public
export const getSingleBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  res.json({
    status: "success",
    msg: "Brand fetched successfully",
    brand,
  });
});

//@desc Update brand
//@route  PUT/api/v1/brands/:id
//@access Private/Admin
export const updateBrandCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //update
  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "Brand updated successfully",
    brand,
  });
});

//@desc Delete brand
//@route  Delete/api/v1/brands/:id
//@access Private/Admin
export const deleteBrandCtrl = asyncHandler(async (req, res) => {
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  res.json({
    status: "success",
    message: `${brand.name} brand deleted successfully`,
  });
});
