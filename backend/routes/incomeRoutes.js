import express from "express";

import authMiddleware from "../middleware/auth.js";
import {
  addIncome,
  deleteIncome,
  downloadIncomeExcel,
  getIncome,
  updateIncome,
} from "../controller/incomeControllers.js";

const incomeRouter = express.Router();

incomeRouter.post("/add", authMiddleware, addIncome);
incomeRouter.get("/get", authMiddleware, getIncome);

incomeRouter.put("/update/:id", authMiddleware, updateIncome);
incomeRouter.get("/downloadexcel", authMiddleware, downloadIncomeExcel);

incomeRouter.delete("/delete/:id", authMiddleware, deleteIncome);

export default incomeRouter;
