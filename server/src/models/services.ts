import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  imgUrl: { type: String },
});

export const ServicerModel = mongoose.model("Service", ServiceSchema);
