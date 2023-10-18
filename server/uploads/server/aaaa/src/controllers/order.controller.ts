import { OrderSchemaModel, OrderStatusEnum } from "../models";
import { deleteStorageFiles } from "../common";
import { Request, Response } from "express";
const os = require("os");

export const createOrder = async (req: any, res: Response) => {
  const { body, user } = req;

  body.user = user._id;
  body.status = OrderStatusEnum.PENDING;
  try {
    await OrderSchemaModel.create(body);
    res.status(201).send(true);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to post");
  }
};

export const getOrderByUser = async (req: any, res: Response) => {
  const { _id } = req.user;

  if (!_id) {
    res.status(400).send("userId is required");
  }
  try {
    const orders = await OrderSchemaModel.find({ user: _id })
      .populate("cart.serviceSubCategory")
      .populate("cart.service")
      .populate("user")
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to fetch order");
  }
};

export const userOrdersByServiceSubCategory = async (
  req: Request,
  res: Response
) => {
  const { userId, serviceSubCategoryId } = req.query;
  if (!userId) {
    res.status(400).send("userId is required");
  }
  if (!serviceSubCategoryId) {
    res.status(400).send("serviceSubCategoryId is required");
  }
  try {
    const orders = await OrderSchemaModel.find({
      user: userId,
      serviceSubCategory: serviceSubCategoryId,
    })
      .populate("serviceSubCategory")
      .populate("user")
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to fetch order");
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { orderId, status } = req.body;
  if (!orderId) {
    res.status(400).send("orderId is required");
  }
  try {
    await OrderSchemaModel.updateOne(
      { _id: orderId },
      {
        $set: {
          status: status,
        },
      }
    );
    res.status(200).send("updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to fetch order");
  }
};

export const getOrders = async (req: any, res: Response) => {
  const { status } = req.query;
  console.log("req", req.user);
  try {
    let query = {};
    if (status) {
      query = {
        $expr: { $eq: [{ $strcasecmp: ["$status", status] }, 0] },
      };
    }
    const orders = await OrderSchemaModel.find(query)
      .populate("serviceSubCategory")
      .populate("service")
      .populate("user")
      .exec();

    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send("Failed to fetch order");
  }
};
