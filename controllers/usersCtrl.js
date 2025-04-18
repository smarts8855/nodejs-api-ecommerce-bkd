import User from "../model/User.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { getTokenFromHeader } from "../utils/getTokenFromHeader.js";
import { verifyToken } from "../utils/verifyToke.js";

//@desc Register user
//@route POST/api/v1/users/register
//access Private/Admin

export const registerUserCtrl = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body;
  //Check user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    //throw

    throw new Error(`User: ${email} already exists`);
  }
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  //create new user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  });
  res.json({
    status: "success",
    msg: "User registered successfully",
    data: user,
  });
});

//@desc Login user
//@route POST/api/v1/users/login
//access public

export const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //Find the user in DB by email only
  const userFound = await User.findOne({ email });
  if (userFound && (await bcrypt.compare(password, userFound?.password))) {
    return res.json({
      status: "success",
      message: "User logged in successfully",
      isAdmin: userFound?.isAdmin,
      token: generateToken(userFound?._id),
    });
  } else {
    throw new Error("Invalid login credentials");
  }
});

//@desc Get user profile
//@route GET/api/v1/users/profile
//access Private
export const getUserProfileCtrl = asyncHandler(async (req, res) => {
  //find the user
  const user = await User.findById(req.userAuthId).populate("orders");
  res.json({
    status: "success",
    message: "User profile fetched successfully",
    user,
  });
});

//@desc Update user shipping address
//@route GET/api/v1/users/update/shipping
//access Private

export const updateShippingAddressCtrl = asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    address,
    city,
    postalCode,
    province,
    phone,
    country,
  } = req.body;
  const userUpdated = await User.findByIdAndUpdate(
    req.userAuthId,
    {
      shippingAddress: {
        firstName,
        lastName,
        address,
        city,
        postalCode,
        province,
        phone,
        country,
      },
      hasShippingAddress: true,
    },
    { new: true }
  );
  res.json({
    status: "success",
    message: "User shipping address updated successfully",
    userUpdated,
  });
});
