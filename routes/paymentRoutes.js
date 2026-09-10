const express = require("express");

const {
  createCashfreeOrder,
  verifyCashfreePayment,
  cashOnDelivery,
} = require("../controllers/paymentController");
const router = express.Router();
router.post("/create-order", createCashfreeOrder);
router.post("/verify-payment", verifyCashfreePayment);
router.post("/cash-on-delivery", cashOnDelivery);

module.exports = router;
