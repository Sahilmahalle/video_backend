import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { limit_KB } from "./constants.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//below are some mandatory setups for app.js
app.use(express.json({ limit: limit_KB }));

app.use(express.urlencoded({ extended: true, limit: limit_KB }));

app.use(express.static("public"));

app.use(cookieParser());

//routes
import userRouter from "./routes/user.routes.js";
// routes decleration
app.use("/api/v1/users", userRouter);
//http:localhots:4000/api/v1/users/register

export default app;
