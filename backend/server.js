
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectdb } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import incomeRouter from "./routes/incomeRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database
connectdb();

// Routes
app.use("/api/user", userRouter);
app.use("/api/income", incomeRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

// Server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
