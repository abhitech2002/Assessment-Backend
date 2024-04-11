import express from "express";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { SignUp } from "../models/signUp.js";

const router = express.Router();

// post
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if user is exists or not
    const user = await SignUp.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password..." });
    }

    // Checking if user email is verified
    if (!user.verified) {
      return res
        .status(401)
        .json({
          message:
            "Email is not verified. Please verify your email before logging in.",
        });
    }

    // Checking if user password is correct or not
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password..." });
    }

    // Genrate JWT token
    const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      data: token,
      message: "User Sign In Sucessfully....",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// get testing
router.get("/", (req, res) => {
  res.send("Test route is working");
});

export default router;
