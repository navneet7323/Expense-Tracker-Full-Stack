import User from "../models/userModel.js";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized or token missing",
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Find user
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Attach user to request
    req.user = user;

    // Continue to controller
    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
}
