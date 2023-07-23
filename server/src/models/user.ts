import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { type: String },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  // type can be customer | owner
  type: {
    type: String,
  },
});

export const UserModel = mongoose.model("User", UserSchema);
