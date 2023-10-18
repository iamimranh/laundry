const { getSession } = require("../jwtAuthentication");
import { NextFunction, Response } from "express";
import { UserModel } from "../models/user";
const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    // const token = req.headers.authorization || req.get("Authorization");
    const token = req.headers.authorization.split(" ")[1];
    if (!token)
      return res.status(400).send("Unauthorised access! Token not Found!");

    const existingSession = getSession(token);

    if (existingSession) {
      const { userPhone } = existingSession;
      const user = await UserModel.findOne({ phone: userPhone });
      if (user) {
        req.user = user;
      }
    }
    if (!existingSession)
      return res
        .status(400)
        .send("Unauthorised access! Session not Found! or Session Expired!");

    next();
  } catch (error) {
    return res.status(401).send("Unauthorised access!");
  }
};

export { authMiddleware };
