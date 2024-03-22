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

  // now create a playlist
  const playlist = await Playlist.create({
    name,
    description,
  });
  if (!playlist) {
    throw new ApiError(500, "something went wrong while creating playlist");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Playlist created successfully"));
});

export default createPlaylist;
