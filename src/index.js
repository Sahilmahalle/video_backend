// require("dotenv").config({path:'./env'});
import dotenv from "dotenv";

import { DB_name } from "./constants.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});

/*
import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_name}`);

    app.on("error", (error) => {
      console.log("ERROR : ", error);
      throw err;
    });

    app.listen(preocess.env.PORT, () => {
      console.log(`app is listening on port ${preocess.env.PORT}`);
    });
  } catch (error) {
    console.log("ERROR:", error);
    throw err;
  }
})();
*/
