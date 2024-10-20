import bcrypt from "bcryptjs";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { generateUniqueId } from "../utils/generateUniqueId.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res.status(404).json({
        success: false,
        message: "User already exist",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateUniqueId();
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    await newUser.save();
    generateTokenAndSetCookie(res, newUser._id);
    res.status(201).json({
      success: true,
      message: "user created successfully",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code } = req.body;

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "invalid or expired verification code",
      });
    }

    user.is_verified = true;
    user.verificationToken = undefined;
    await user.save();

    // send mail to verified user

    res.status(200).json({
      success: true,
      message: "email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return rss.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    generateTokenAndSetCookie(res, user?._id);
    user.last_login = Date.now();
    await user.save();
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user?._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error?.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const forgotPasswordCode = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 24 * 60 * 60 * 1000;

    user.resetPasswordToken = forgotPasswordCode;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    // send forgotPasswordCode on email forgotPasswordCode

    res.status(200).json({
      success: true,
      message: "Successfully send link to reset password",
      link: forgotPasswordCode,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "invalid or expires reset token",
      });
    }
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    // send email to reset password

    res.status(200).json({
      success: true,
      message: "password reset successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: true,
      message: error?.message,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "unauthorized access resources",
      });
    }

    res.status(200).json({
      success: false,
      message: "user successfully loaded",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error?.message,
    });
  }
};
