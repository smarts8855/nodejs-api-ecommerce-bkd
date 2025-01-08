import asyncHandler from "express-async-handler";
import Category from "../model/Category.js";
//@desc Create new category
//@route POST /api/v1/categoies
//@access Private/Admin
export const createCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;
  //category exists
  const categoryFound = await Category.findOne({ name });
  if (categoryFound) {
    throw new Error(`${categoryFound.name} cateory already exists`);
  }
  //create
  const category = await Category.create({
    name: name?.toLowerCase(),
    user: req.userAuthId,
    file: req?.file?.path,
  });
  res.json({
    status: "success",
    msg: "Category created successfully",
    category,
  });
});

//@desc Get all categories
//@route GET /api/v1/categoies
//@access public
export const getAllCategoriesCtrl = asyncHandler(async (req, res) => {
  const categories = await Category.find();

  res.json({
    status: "success",
    msg: "Categories fetched successfully",
    categories,
  });
});

//@desc Get single category
//@route GET /api/v1/categoies/:id
//@access public
export const getSingleCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  res.json({
    status: "success",
    msg: "Category fetched successfully",
    category,
  });
});

//@desc Update category
//@route  PUT/api/v1/categories/:id
//@access Private/Admin
export const updateCategoryCtrl = asyncHandler(async (req, res) => {
  const { name } = req.body;

  //update
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      name,
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "category updated successfully",
    category,
  });
});

//@desc Delete category
//@route  Delete/api/v1/categories/:id
//@access Private/Admin
export const deleteCategoryCtrl = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    throw new Error("Category not found");
  }
  res.json({
    status: "success",
    message: `${category.name} category deleted successfully`,
  });
});
