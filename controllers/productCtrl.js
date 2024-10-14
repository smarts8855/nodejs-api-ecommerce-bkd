import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

//@desc Create new product
//@route  POST/api/v1/products
//@access private
export const createProduct = asyncHandler(async (req, res) => {
  const convertedImgs = req.files.map((file) => file.path);
  const {
    name,
    description,
    category,
    sizes,
    colors,

    price,
    totalQty,
    brand,
  } = req.body;
  //Product exists
  const productExists = await Product.findOne({ name });
  if (productExists) {
    throw new Error(`Product ${name} already exists`);
  }
  //find the category
  const categoryFound = await Category.findOne({ name: category });
  if (!categoryFound) {
    throw new Error(
      ` Category not found, please create category first or check category name`
    );
  }

  //find the brand
  const brandFound = await Brand.findOne({ name: brand.toLowerCase() });
  if (!brandFound) {
    throw new Error(
      ` Brand not found, please create brand first or check brand name`
    );
  }
  //create the product
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: convertedImgs,
  });
  //push the product into category
  categoryFound.products.push(product._id);
  //save
  await categoryFound.save();
  //push the product into brand
  brandFound.products.push(product._id);
  await brandFound.save();
  //send response
  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

//@desc Get all product
//@route  GET/api/v1/products
//@access public
export const getProductsCtrl = asyncHandler(async (req, res) => {
  //query
  let productQuery = Product.find();
  //await the query
  //search by product name
  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
    });
  }
  //search by product brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }
  //search by product category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }
  //search by product colors
  if (req.query.colors) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.colors, $options: "i" },
    });
  }
  //search by product sizes
  if (req.query.sizes) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.sizes, $options: "i" },
    });
  }
  //filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    //gte: greater or equal
    //lte: less than or equal to
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //pagenation
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
  //limit
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 1;
  //startIdx
  const startIndex = (page - 1) * limit;
  //endIdx
  const endIndex = page * limit;
  //total
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIndex).limit(limit);
  //pagination results
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  //await the query
  const products = await productQuery.populate("reviews");
  res.status(200).json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Product fetch successfully",
    products,
  });
});

//@desc Get single product
//@route  GET/api/v1/products/:id
//@access public
export const getProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");
  if (!product) {
    throw new Error("Product not found");
  }
  res.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

//@desc Update product
//@route  PUT/api/v1/products/:id
//@access Private/Admin
export const updateProductCtrl = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});

//@desc Delete product
//@route  Delete/api/v1/products/:id
//@access Private/Admin
export const deleteProductCtrl = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    throw new Error("Product not found");
  }
  res.json({
    status: "success",
    message: `${product.name} deleted successfully`,
  });
});
