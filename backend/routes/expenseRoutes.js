import express from "express";

import authMiddleware from "../middleware/auth.js";
import {
  addExpense,
  downloadExpenseExcel,
  getExpense,
  updateExpense,
  deleteExpense,
} from "../controller/expenseController.js";

const expenseRouter = express.Router();

// Add Expense
expenseRouter.post("/add", authMiddleware, addExpense);

// Get All Expenses / Filtered Expenses
expenseRouter.get("/get", authMiddleware, getExpense);

// Update Expense
expenseRouter.put("/update/:id", authMiddleware, updateExpense);

// Download Expenses as Excel
expenseRouter.get("/downloadexcel", authMiddleware, downloadExpenseExcel);

// Delete Expense
expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);

export default expenseRouter;
