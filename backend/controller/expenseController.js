import mongoose from "mongoose";
import Expense from "../models/expenseModels.js";
import getDateRange from "../utlis/dateFilter.js";
import ExcelJS from "exceljs";

// ============================================
// ADD EXPENSE
// ============================================

export async function addExpense(req, res) {
  try {
    const userId = req.user._id;

    const { description, amount, category, date } = req.body;

    // Validate required fields
    if (
      !description?.trim() ||
      amount === undefined ||
      amount === null ||
      !category?.trim() ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "Description, amount, category and date are required",
      });
    }

    // Validate amount
    const expenseAmount = Number(amount);

    if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Validate date
    const expenseDate = new Date(date);

    if (Number.isNaN(expenseDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    // Create expense
    const expense = await Expense.create({
      userId,
      description: description.trim(),
      amount: expenseAmount,
      category: category.trim(),
      date: expenseDate,
      type: "expense",
    });

    return res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (err) {
    console.error("Add expense error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while adding expense",
    });
  }
}

// ============================================
// GET EXPENSES
// ============================================
// ?range=daily
// ?range=weekly
// ?range=monthly
// ?range=yearly
// ============================================

export async function getExpense(req, res) {
  try {
    const userId = req.user._id;
    const { range } = req.query;

    const query = {
      userId,
    };

    // Validate range
    if (range) {
      const validRanges = ["daily", "weekly", "monthly", "yearly"];

      if (!validRanges.includes(range)) {
        return res.status(400).json({
          success: false,
          message: "Invalid range. Use daily, weekly, monthly or yearly",
        });
      }

      const { start, end } = getDateRange(range);

      query.date = {
        $gte: start,
        $lte: end,
      };
    }

    // Get expenses
    const expenses = await Expense.find(query).sort({
      date: -1,
    });

    // Calculate total
    const totalExpense = expenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );

    return res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      count: expenses.length,
      totalExpense,
      expenses,
    });
  } catch (err) {
    console.error("Get expense error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching expenses",
    });
  }
}

// ============================================
// UPDATE EXPENSE
// ============================================

export async function updateExpense(req, res) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    const { description, amount, category, date } = req.body;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    // Validate required fields
    if (
      !description?.trim() ||
      amount === undefined ||
      amount === null ||
      !category?.trim() ||
      !date
    ) {
      return res.status(400).json({
        success: false,
        message: "Description, amount, category and date are required",
      });
    }

    // Validate amount
    const expenseAmount = Number(amount);

    if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Validate date
    const expenseDate = new Date(date);

    if (Number.isNaN(expenseDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    // Update only user's expense
    const expense = await Expense.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        description: description.trim(),
        amount: expenseAmount,
        category: category.trim(),
        date: expenseDate,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (err) {
    console.error("Update expense error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while updating expense",
    });
  }
}

// ============================================
// DELETE EXPENSE
// ============================================

export async function deleteExpense(req, res) {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid expense ID",
      });
    }

    // Delete only user's expense
    const expense = await Expense.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      expense,
    });
  } catch (err) {
    console.error("Delete expense error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting expense",
    });
  }
}

// ============================================
// DOWNLOAD EXPENSE EXCEL
// ============================================
// ?range=daily
// ?range=weekly
// ?range=monthly
// ?range=yearly
// ============================================

export async function downloadExpenseExcel(req, res) {
  try {
    const userId = req.user._id;
    const { range } = req.query;

    const query = {
      userId,
    };

    // Validate range
    if (range) {
      const validRanges = ["daily", "weekly", "monthly", "yearly"];

      if (!validRanges.includes(range)) {
        return res.status(400).json({
          success: false,
          message: "Invalid range. Use daily, weekly, monthly or yearly",
        });
      }

      const { start, end } = getDateRange(range);

      query.date = {
        $gte: start,
        $lte: end,
      };
    }

    // Get expenses
    const expenses = await Expense.find(query).sort({
      date: -1,
    });

    // Create workbook
    const workbook = new ExcelJS.Workbook();

    // Create worksheet
    const worksheet = workbook.addWorksheet("Expenses");

    // Columns
    worksheet.columns = [
      {
        header: "Description",
        key: "description",
        width: 30,
      },
      {
        header: "Amount",
        key: "amount",
        width: 15,
      },
      {
        header: "Category",
        key: "category",
        width: 20,
      },
      {
        header: "Date",
        key: "date",
        width: 20,
      },
    ];

    // Add expenses
    expenses.forEach((expense) => {
      const row = worksheet.addRow({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
      });

      row.getCell("date").numFmt = "yyyy-mm-dd";
      row.getCell("amount").numFmt = "#,##0.00";
    });

    // Header styling
    const headerRow = worksheet.getRow(1);

    headerRow.font = {
      bold: true,
    };

    headerRow.alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Freeze header row
    worksheet.views = [
      {
        state: "frozen",
        ySplit: 1,
      },
    ];

    // Total row
    const totalExpense = expenses.reduce(
      (total, expense) => total + expense.amount,
      0,
    );

    const totalRow = worksheet.addRow({
      description: "TOTAL EXPENSE",
      amount: totalExpense,
    });

    totalRow.font = {
      bold: true,
    };

    totalRow.getCell("amount").numFmt = "#,##0.00";

    // Response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="expenses-${range || "all"}.xlsx"`,
    );

    // Send Excel file
    await workbook.xlsx.write(res);

    res.end();
  } catch (err) {
    console.error("Download expense Excel error:", err);

    return res.status(500).json({
      success: false,
      message: "Error while downloading expense data",
    });
  }
}
