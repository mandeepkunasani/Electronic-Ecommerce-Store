const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Register
router.post("/register", async (req, res) => {
  const user = new User(req.body);

  await user.save();

  res.json({
    message: "User Registered Successfully",
  });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email,
    password,
  });

  if (user) {
    res.json({
      success: true,
      user,
    });
  } else {
    res.json({
      success: false,
      message: "Invalid Credentials",
    });
  }
});

module.exports = router;