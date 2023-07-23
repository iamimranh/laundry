import { OrderSchemaModel, OrderStatusEnum } from "../models";
import { deleteStorageFiles } from "../common";
import { Request, Response } from "express";
const os = require("os");
const platform = os.platform();

export const createOrder = async (req: any, res: Response) => {
  const filesUrl = req.files?.map((itm: any) => {
    if (platform === "win32") {
      return itm?.path?.split("\\")[1];
    } else {
      return itm?.path?.split("/")[1];
    }
  });
  try {
    const {
      address,
      instructions,
      price,
      user,
      serviceSubCategory,
      service,
      count,
      deliveryType,
      imgUrl,
    } = req.body;

    let attachmentsUrls = [...filesUrl];
    if (imgUrl?.length) {
      attachmentsUrls = attachmentsUrls.concat(imgUrl);
    }

    const orderPayload = {
      address,
      instructions,
      price,
      user,
      serviceSubCategory,
      service,
      imgUrl: attachmentsUrls,
      status: OrderStatusEnum.PENDING,
      count,
      deliveryType,
    };
    await OrderSchemaModel.create(orderPayload);
    res.status(201).send(true);
  } catch (error) {
    console.log(error);
    deleteStorageFiles(filesUrl);
    res.status(500).send("Failed to post");
  }
};

export const getOrderByUser = async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    res.status(400).send("userId is required");
  }
  try {
    const orders = await OrderSchemaModel.find({ user: userId })
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
