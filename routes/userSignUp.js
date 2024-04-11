import express from "express";
import bcrypt from "bcrypt";
import { SignUp } from "../models/signUp.js";
import { validateUser } from "../middleware/validationUser.js";
import genrateOTP from "../utils/utils.js";
import sendOTPEmail from "../utils/sendEmail.js";
import { OTP } from "../models/otpModel.js";

const router = express.Router();

// Getting User details
router.get("/", async (req, res) => {
  try {
    const user = await SignUp.find({});
    return res.status(200).send({
      count: user.length,
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
});

// Sign-up Route
router.post("/", validateUser, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      location,
      userName,
      password,
      repassword,
    } = req.body;

    //Checking if user already exist
    const exisitingUser = await SignUp.findOne({ email });
    if (exisitingUser) {
      return res.status(400).send({ message: "User Already Exists" });
    }

    // if password and repassword match
    if (password !== repassword) {
      return res.status(400).send({ message: "Password do not match" });
    }

    // Encrypting password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creating new user
    const newUser = new SignUp({
      firstName,
      lastName,
      email,
      location,
      userName,
      password: hashedPassword,
    });
    await newUser.save();

    // // Generate OTP
    // const otp = genrateOTP();

    // // Save OTP to the database
    // const otpEntry = new OTP({ email, otp });
    // await otpEntry.save();

    // // Send OTP via email
    // sendOTPEmail(email, otp);

    res
      .status(201)
      .send({
        message:
          "User Created Successfully. Verification OTP sent to your email.",
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/send-otp", async (req, res) => {
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
      .send({ message: "OTP sent to your email verification" });
  } catch (error) {
    console.error(error.stack);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check if OTP is valid
    const otpEntry = await OTP.findOne({ email, otp });
    if (!otpEntry) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    // Delete the OTP entry from the database
    await OTP.deleteOne({ _id: otpEntry._id });

    await SignUp.findOneAndUpdate({ email }, { verified: true });

    res.status(200).send({ message: "Email verified successfully" });
  } catch (error) {
    console.error(error.stack);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

export default router;
