import mongoose from "mongoose";

export const connectdb = async () => {
  await mongoose
    .connect(
      "mongodb+srv://navneetsingh70mth_db_user:hxER4340o7YwElDF@cluster0.xcqmivb.mongodb.net/Expense",
    )
    .then(() => {
      console.log("DB connected in console");
    })
    .catch((err) => {
      console.log("DB connection failed:", err);
    });
};
