const express = require("express");
const axios = require("axios");

const COZE_API_URL = "https://api.coze.com/open_api/v2/chat";
const API_KEY = process.env.COZE_API_KEY || "pat_rNzWaoL6vNTFG0PHLRqaQVtO7Zs8ClOD2tzZHSQc9W7oebgKbrjOFq2edL225sKd"; 
const BOT_ID = "7471465917801676818"; 

const router = express.Router();
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/authentication");
const model = require("../models/index");

require("dotenv/config");

const api = process.env.API_URL;
router.route("/").get(async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
  const apiUrl = `${baseUrl}${api}`;
  let products = await fetch(`${apiUrl}/product`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  console.log(products);
  res.render("page/homepage.ejs", { products: products });
});
router.route("/product-detail/:id").get(async (req, res) => {
  const id = req.params.id;
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
  const apiUrl = `${baseUrl}${api}`;
  const product = await fetch(`${apiUrl}/product/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  res.render("page/detailProduct.ejs", { product: product });
});
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("page/login.ejs", { error: req.flash("error") });
});
router.get("/info", checkAuthenticated, (req, res) => {
  const user = req.user;
  res.render("page/profile.ejs", { user: user });
});
router.get("/my-account", checkAuthenticated, async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
  const apiUrl = `${baseUrl}${api}`;
  const user = req.user;
  const response = await fetch(`${apiUrl}/order/user/last/${user._id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  res.render("page/my-account.ejs", {
    user: user,
    order:
      {
        ...response.lastOrder,
        dateOrdered: new Date(response.lastOrder.dateOrdered),
      } || false,
  });
});
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("page/register.ejs");
});
router.get("/signup-next", checkNotAuthenticated, (req, res) => {
  res.render("page/signup-next.ejs");
});
router.get("/to-pay", (req, res) => {
  res.render("page/to-pay.ejs");
});
router.get("/product-page", async (req, res) => {
  const queryString = new URLSearchParams(req.query).toString();
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
  const apiUrl = `${baseUrl}${api}`;
  const products = await fetch(`${apiUrl}/product?${queryString}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  const category = req.query.category || "ALL";
  res.render("page/product-page.ejs", {
    products: products,
    category: category,
  });
});
router.get("/cart", checkAuthenticated, async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
  const apiUrl = `${baseUrl}${api}`;
  const data = await fetch(`${apiUrl}/cart`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Cookie: req.headers.cookie,
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  res.render("page/cart.ejs", { cartItems: data.itemsInCart, user: req.user });
});
router.get("/order", checkAuthenticated, async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
  const apiUrl = `${baseUrl}${api}`;
  const data = await fetch(`${apiUrl}/cart`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Cookie: req.headers.cookie,
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  res.render("page/order.ejs", { cartItems: data.itemsInCart, user: req.user });
});
router.post("/order", checkAuthenticated, async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
  const apiUrl = `${baseUrl}${api}`;
  const data = await fetch(`${apiUrl}/cart`, {
    method: "GET",
    credentials: "same-origin",
    headers: {
      Cookie: req.headers.cookie,
      "Content-Type": "application/json",
    },
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  const orderItems = data.itemsInCart.map((item) => {
    return {
      product: item.product.id,
      quantity: item.quantity,
    };
  });
  const requestBody = {
    user: req.user.id,
    phoneNumber: req.body.phoneNumber,
    fullName: req.body.fullName,
    orderItems: orderItems,
    paymentMethod: req.body.paymentMethod,
    shippingAddress: req.body.address,
  };
  const orderData = await fetch(`${apiUrl}/order`, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Cookie: req.headers.cookie,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));
  if (orderData.success) {
    await fetch(`${apiUrl}/cart/clear`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        Cookie: req.headers.cookie,
        "Content-Type": "application/json",
      },
    });
    res.redirect("/success-order");
  }
});
router.get("/success-order", (req, res) => {
  res.render("page/success-order.ejs");
});

router.post("/chat", async (req, res) => {
  try {
        const { userMessage } = req.body;
        console.log(userMessage);
        const payload = {
            bot_id: BOT_ID,
            user: "guest" ,
            query: userMessage 
        };
        const response = await axios.post(COZE_API_URL, payload, {
            headers: { 
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(response.data);
        res.json({ botReply: response.data.messages[2].content || "Không có phản hồi từ AI." });
      } catch (error) {
        console.error("Lỗi khi gọi Coze API:", error.response?.data || error.message);
        res.status(500).json({ error: "Lỗi khi kết nối chatbot." });
      }
});

module.exports = router;
