import { NextFunction, Response } from "express";

export const ownerCheckMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  if (req?.user?.type?.toLocaleLowerCase() === "Owner".toLocaleLowerCase()) {
    next();
  } else {
    res.status(401).send("Unauthorize");
  }
};
