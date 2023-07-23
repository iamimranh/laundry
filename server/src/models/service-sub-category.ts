import mongoose from "mongoose";

const ServiceSubCategorySchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  imgUrl: { type: String },
  type: { type: String },
  price: { type: Number },
});

export const ServiceSubCategoryModel = mongoose.model(
  "ServiceSubCategory",
  ServiceSubCategorySchema
);
