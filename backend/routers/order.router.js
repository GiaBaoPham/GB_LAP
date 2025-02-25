const express = require("express");
const Order = require("../models/order.model");
const OrderItem = require("../models/order-item.model");
const mongoose = require("mongoose");
const { populate } = require("../models/users.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "username")
    .sort({ dateOrdered: -1 });
  if (!orderList) {
    res.status(500).json({ sucees: false });
  }
  res.send(orderList);
});
router.get("/user/last/:user", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.user)) {
    res.status(400).json("Invalid user id");
  }

  const filter = {
    user: req.params.user,
  };
  const lastOrder = await Order.findOne(filter)
    .sort({ dateOrdered: -1 })
    .limit(1)
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        select: "price name imgName category",
        populate: {
          path: "category",
        },
      },
    });
  if (!lastOrder) {
    return res.status(404).json({ message: "No orders found for this user" });
  }
  res.status(200).json({ message: "Found", lastOrder: lastOrder });
});

router.post("/", async (req, res) => {
  const orderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIds;
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemId) => {
      const orderItem = await OrderItem.findById(orderItemId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;
      return totalPrice;
    })
  );
  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
  let order = new Order({
    user: req.body.user,
    phoneNumber: req.body.phoneNumber,
    fullName: req.body.fullName,
    orderItems: orderItemsIdsResolved,
    totalPrice: totalPrice,
    status: req.body.status || "pending",
    paymentMethod: req.body.paymentMethod,
    shippingAddress: req.body.shippingAddress,
  });
  order = await order.save();
  if (!order) {
    return res
      .status(400)
      .json({ success: false, message: "The order cannot created" });
  }
  res.json({ success: true, order: order });
});

router.delete("/:id", (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid order id");
  }
  Order.findByIdAndDelete(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndDelete(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "The order was deteted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "No order with id" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});
router.patch("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid order id");
  }
  const updates = { ...req.body };
  const updatedOrder = await Order.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  }).catch((err) => {
    return res.status(400).json({ sucees: false, error: err });
  });
  res.status(200).send(updatedOrder);
});
module.exports = router;
