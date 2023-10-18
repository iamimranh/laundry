const multer = require("multer");
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: any) {
    cb(null, "uploads/"); // Set the destination folder for uploaded files
  },
  filename: function (req: Request, file: any, cb: any) {
    cb(null, uuidv4() + "-" + file.originalname.replace(/[\s@#$%^&*()]/g, "")); // Set the file name format
  },
});

export const upload = multer({ storage: storage });
