import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { LIMIT, limit_KB } from "./constants";

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

export default app;
