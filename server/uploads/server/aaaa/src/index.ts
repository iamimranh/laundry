require("dotenv").config();
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./db";
import { router } from "./router";
const app = express();

const port = process.env.SERVER_PORT || 4000;
const corsConfig = {
  origin: "http://localhost:3000",
  method: ["GET", "POST"],
  credentials: true,
};
app.use(express.static("uploads"));
app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});
