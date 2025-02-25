const express = require("express");
const User = require("../models/users.model");
const passport = require("passport");
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require("../middleware/authentication");
const router = express.Router();

router.get("/", async (req, res) => {
  const userList = await User.find().select("-password");
  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

router.post("/", async (req, res) => {
  try {
    if (await User.findOne({ email: req.body.email })) {
      throw new Error("This email is already registered.");
    }
    let user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
    });
    user = await user.save();
    if (!user) {
      return res.status(400).send("The user cannot created");
    }
    res.status(200).json({ success: true, user: user });
  } catch (error) {
    if (
      error.message ===
      "User validation failed: email: Please provide a valid email address"
    ) {
      error.message = "Invalid email";
    }
    res.status(400).json({ success: false, message: error.message });
  }
});
//login
router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureFlash: "Your email or password is incorect",
  })
);
//info
router.get("/info", checkAuthenticated, (req, res) => {
  const user = req.user;
  if (!user) {
    res.json({ message: "May chua dang nhap" });
  }
  res.json(user);
});
//logout
router.post("/logout", checkAuthenticated, (req, res) => {
  req.logOut((e) => {
    if (e) {
      return next(e);
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.clearCookie("connect.sid");
      res.redirect("/login");
    });
  });
});

module.exports = router;
