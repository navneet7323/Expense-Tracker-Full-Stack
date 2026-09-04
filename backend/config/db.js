import mongoose from "mongoose";

export const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB connected successfully");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    throw error;
  }
};
