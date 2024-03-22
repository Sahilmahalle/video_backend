import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/APIerror.js";
import ApiResponse from "../utils/APIresponse.js";
import { Playlist } from "../models/playlists.models.js";

//below code is written by me without any guidance and later gonna upadte with correct code 22/03/2024
const createPlaylist = asyncHandler(async (req, res) => {
  //get playlist name and description from user

  const { name, description } = req.body;
  console.log("playlist name and description");
  //below check if we get playlist name
  if (!name) {
    throw new ApiError(400, "Name is required");
  }
  if (!description) {
    throw new ApiError(400, "Description is Required");
  }
});

export default createPlaylist;
