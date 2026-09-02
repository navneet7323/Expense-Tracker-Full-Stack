import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectdb } from "./config/db.js";
dotenv.config();
const app = express();

const PORT = 4000;

app.get("/", (req, res) => {
  res.send("API Working");
});
//mdware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//DB
connectdb();
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
