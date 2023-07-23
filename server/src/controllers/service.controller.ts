import { ServiceSubCategoryModel, ServicerModel } from "../models";
import { Request, Response } from "express";

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await ServicerModel.find({});
    res.status(201).send(services);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to fetch services");
  }
};

export const getServicesSubCategories = async (req: Request, res: Response) => {
  try {
    const { type }: any = req.query;
    if (!type) {
      res.status(400).send("type is required");
    }
    const services = await ServiceSubCategoryModel.find({
      $expr: { $eq: [{ $strcasecmp: ["$type", type] }, 0] },
    });
    res.status(201).send(services);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to fetch services");
  }
};
