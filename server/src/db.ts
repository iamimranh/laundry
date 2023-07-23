import mongoose from "mongoose";

mongoose.Promise = Promise;

mongoose.connect(process.env.DB_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));
mongoose.connection.on("success", () => console.log("DB connected!"));

export { mongoose };
