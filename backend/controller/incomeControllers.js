import Income from "../models/incomeModels.js";
import getDateRange from "../utlis/dateFilter.js";
import ExcelJS from "exceljs";

// Add Income
export async function addIncome(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Description, amount, category and date are required",
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const income = await Income.create({
      userId, // Fixed from user: userId
      description,
      amount: Number(amount),
      category,
      date: new Date(date),
    });

    return res.status(201).json({
      success: true,
      message: "Income added successfully",
      income,
    });
  } catch (err) {
    console.error("Add income error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while adding income",
      error: err.message,
    });
  }
}

// Get Income (With optional date range filter: ?range=weekly / monthly / yearly / daily)
export async function getIncome(req, res) {
  const userId = req.user._id;
  const { range } = req.query;

  try {
    let query = { userId }; // Fixed from user: userId

    if (range) {
      const { start, end } = getDateRange(range);
      query.date = { $gte: start, $lte: end };
    }

    const incomes = await Income.find(query).sort({ date: -1 });

    return res.status(200).json({
      success: true,
      message: "Income fetched successfully",
      count: incomes.length,
      incomes,
    });
  } catch (err) {
    console.error("Get income error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching income",
      error: err.message,
    });
  }
}

// Update Income
export async function updateIncome(req, res) {
  const userId = req.user._id;
  const { id } = req.params;
  const { description, amount, category, date } = req.body;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Income ID is required" });
    }

    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Description, amount, category and date are required",
      });
    }

    if (Number(amount) <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Amount must be greater than 0" });
    }

    const income = await Income.findOneAndUpdate(
      { _id: id, userId }, // Fixed from user: userId
      { description, amount: Number(amount), category, date: new Date(date) },
      { new: true, runValidators: true },
    );

    if (!income) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Income updated successfully",
      income,
    });
  } catch (err) {
    console.error("Update income error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating income",
      error: err.message,
    });
  }
}

// Delete Income
export async function deleteIncome(req, res) {
  const userId = req.user._id;
  const { id } = req.params;

  try {
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Income ID is required" });
    }

    const income = await Income.findOneAndDelete({ _id: id, userId }); // Fixed from user: userId

    if (!income) {
      return res
        .status(404)
        .json({ success: false, message: "Income not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Income deleted successfully",
      income,
    });
  } catch (err) {
    console.error("Delete income error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting income",
      error: err.message,
    });
  }
}

// Download Income Excel (Supports optional ?range= filter as well)
export async function downloadIncomeExcel(req, res) {
  const userId = req.user._id;
  const { range } = req.query;

  try {
    let query = { userId }; // Fixed from user: userId

    if (range) {
      const { start, end } = getDateRange(range);
      query.date = { $gte: start, $lte: end };
    }

    const incomes = await Income.find(query).sort({ date: -1 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Income");

    worksheet.columns = [
      { header: "Description", key: "description", width: 30 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Category", key: "category", width: 20 },
      { header: "Date", key: "date", width: 20 },
    ];

    incomes.forEach((income) => {
      const row = worksheet.addRow({
        description: income.description,
        amount: income.amount,
        category: income.category,
        date: income.date ? new Date(income.date) : "",
      });

      row.getCell("date").numFmt = "yyyy-mm-dd";
    });

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader("Content-Disposition", 'attachment; filename="income.xlsx"');

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Download income Excel error:", err);
    return res.status(500).json({
      success: false,
      message: "Error while downloading income data",
      error: err.message,
    });
  }
}
