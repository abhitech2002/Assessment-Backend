import express from "express";
import bcrypt from "bcrypt";
import { SignUp } from "../models/signUp.js";
import genrateOTP from "../utils/utils.js";
import sendOTPEmail from "../utils/sendEmail.js";
import { OTP } from "../models/otpModel.js";

const router = express.Router();

// Route to request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists with the provided email
    const user = await SignUp.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with the provided email" });
    }

    // Generate OTP
    const otp = genrateOTP();

    // Save OTP to the database
    const otpEntry = new OTP({ email, otp });
    await otpEntry.save();

    // Send OTP via email
    sendOTPEmail(email, otp);

    res
      .status(200)
      .send({ message: "OTP sent to your email for password reset" });
  } catch (error) {
    console.error(error.stack);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Route to verify OTP
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP is valid
    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    await OTP.deleteOne({ email, otp });

    res.status(200).send({ message: "OTP verified successfully" });
  } catch (error) {
    console.error(error.stack);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Route to reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Update user's password in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await SignUp.findOneAndUpdate({ email }, { password: hashedPassword });

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error.stack);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// Route to reset password with taking email, otp, newPass
router.post("/reset-pass", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if OTP is valid
    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    // Update user's password in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await SignUp.findOneAndUpdate({ email }, { password: hashedPassword });

    // Remove the OTP entry from the database
    await OTP.deleteOne({ email, otp });

    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error.stack);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
