import mongoose from "mongoose";

export enum OrderStatusEnum {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
const OrderSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    instructions: { type: String },
    price: { type: Number, required: true },
    deliveryType: { type: String, required: true },
    status: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cart: [
      {
        serviceSubCategory: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ServiceSubCategory",
        },
        quantity: { type: Number, required: true, default: 0 },
        service: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
      },
    ],
  },
  //@ts-ignore
  { strictPopulate: false }
);

export const OrderSchemaModel = mongoose.model("Order", OrderSchema);
