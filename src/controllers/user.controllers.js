import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/APIerror.js";
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/APIresponse.js";

//below method used to generate generate Access And Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateRefreshToken();
    const refreshToken = user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating refresh and access error"
    );
  }
};

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
    coverInmagePath = req.files.coverImage[0].path;
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

const loginUser = asyncHandler(async (req, res) => {
  //request deatils from body
  //get username and email
  //find the username
  //check password
  //access and refresh token
  // send cookies

  const { username, password, email } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  console.log(isPasswordValid);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password credential");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // const loggedInUser = await User.findById(user._id).select(
  //   "-password -refreshToken" //this method allows not wanted fields
  // );

  const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const { email, username, password } = req.body;
    console.log(email, password, username);

    if (!username && !email) {
      throw new ApiError(400, "username or email is required");
    }

    // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")

    // }

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged In Successfully"
        )
      );
  });

  //by default anyone can mpdify your cookies in frontend

  const options = {
    //in this way cookies can only get modify through server
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user Logged In successfully"
      )
    );
});

const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      refreshToken: undefined,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

export { registerUser, loginUser, logOutUser };
