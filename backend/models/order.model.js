const mongoose = require("mongoose");
const { product } = require(".");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "OrderItem",
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["credit_card", "paypal", "cash_on_delivery"],
    required: true,
  },
  shippingAddress: {
    type: String,
    require: true,
  },
  dateOrdered: {
    type: Date,
    require: true,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
