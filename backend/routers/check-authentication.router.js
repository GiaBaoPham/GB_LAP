const express = require("express");
const { Cookie } = require("express-session");
const router = express.Router();

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ isAuthenticated: true });
  }
  res.json({ isAuthenticated: false, cookie: req.headers.cookie || "none" });
});
module.exports = router;
