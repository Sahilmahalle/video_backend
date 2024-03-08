import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/APIerror.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/APIresponse.js";

const registerUser = asyncHandler(async (req, res) => {
  //get user detail from front end or postman
  //validation of name email password not empty
  //cheack if user already exists:using email or name
  //check for images , check for avatar
  //upload them to cloudinary, avatar
  //create user object- create entry in DB
  //remove password and refresh token field from response
  //check for user creation
  //return response

  const { fullName, email, username, password } = req.body;
  console.log(fullName);
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  if (!email.includes("@")) {
    throw new ApiError(400, "invalid email address");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverInmagePath = req.files?.coverImage[0]?.path;
  let coverInmagePath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.lenght > 0
  ) {
    coverInmagePath = req.files?.coverImage[0]?.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverInmagePath);

  if (!avatar) {
    throw new ApiError(409, "User with email or username exist");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: avatar?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering a user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

export default registerUser;
