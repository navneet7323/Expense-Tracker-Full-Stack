import express from "express";
import {updateProfile,
  getCurrentUser,
  registerUser,
  updatePassword,
  loginUser,
} from "../controller/userControllers.js";

import authMiddleware from "../middleware/auth.js";
const userRouter = express.Router();
userRouter.post("/register", registerUser);
userRouter.post("/login",loginUser);

userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.put("/me", authMiddleware, updateProfile);

userRouter.put("/password", authMiddleware, updatePassword);//d

export default userRouter;
