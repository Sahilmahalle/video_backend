// require("dotenv").config({path:'./env'});
import dotenv from "dotenv";
import app from "./app.js";
import { DB_name } from "./constants.js";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("error", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("mongo db connection error", error);
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
