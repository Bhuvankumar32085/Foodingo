import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { genToken } from "../utils/generateToken.js";
import { generateOtp } from "../utils/generateOtp.js";
import {
  sendOtpForEmailVerification,
  sendOtpOnEmail,
  sendWelcom,
} from "../config/nodemailer/email.js";
import Otp from "../models/otp.model.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;
    if (!fullName || !email || !password || !mobile || !role) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "password  must be at least 6 characters.",
      });
    }

    if (mobile.length != 10) {
      return res.status(400).json({
        success: false,
        message: "modiel number  must be 10 degits.",
      });
    }

    let user = await User.findOne({ email });
    const hastPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const otpExpires = Date.now() + 5 * 60 * 1000;

    if (user) {
      if (user.isVerified) {
        return res.status(401).json({
          success: false,
          message: "This Email Already Verified.",
        });
      }
      //if user exists
      user.password = hastPassword;
      user.fullName = fullName;
      user.mobile = mobile;
      user.role = role;
      await user.save();

      let OtpSchema = await Otp.findOne({ email });
      if (!OtpSchema) {
        OtpSchema = new Otp({ email, otp, otpExpires });
      } else {
        OtpSchema.otp = otp;
        OtpSchema.otpExpires = otpExpires;
      }
      await OtpSchema.save();

      const token = await genToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });

      await sendOtpForEmailVerification(email, otp);

      return res.status(201).json({
        success: true,
        message: "Otp Send On Your Email.",
        user,
      });
    }

    await Otp.create({
      email,
      otp,
      otpExpires,
    });

    user = await User.create({
      fullName,
      email,
      password: hastPassword,
      role,
      mobile,
    });

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    await sendOtpForEmailVerification(email, otp);

    return res.status(201).json({
      success: true,
      message: "Otp Send On Your Email.",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "signup error",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found.",
      });
    }

    if (!user.isVerified) {
      return res.status(404).json({
        success: false,
        message: "Plese Verified Your Account.",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Plese Loging With Google.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "password  must be at least 6 characters.",
      });
    }

    const isPassword = await bcrypt.compare(password, user?.password);
    if (!isPassword) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password.",
      });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    await sendWelcom(user.email, user.fullName);

    return res.status(200).json({
      success: true,
      message: "User Login successfully.",
      user,
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "SignIn error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout error",
    });
  }
};

export const virifyOtpForSignup = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp)
      return res.status(401).json({
        success: false,
        message: "otp is required",
      });

    let user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found in this email",
      });

    if (user.isVerified)
      return res.status(404).json({
        success: false,
        message: "User Already Verified in this email",
      });

    let otpSchema = await Otp.findOne({ email });
    if (!otpSchema)
      return res.status(404).json({
        success: false,
        message: "Otp not found in this email",
      });

    if (otp != otpSchema.otp)
      return res.status(401).json({
        success: false,
        message: "InValied OTP",
      });

    if (Date.now() > otpSchema.otpExpires)
      return res.status(401).json({
        success: false,
        message: "Otp Expires",
      });

    user.isVerified = true;
    await user.save();

    await Otp.deleteOne({ email });

    return res.status(200).json({
      success: true,
      message: "Account Created SuccessFully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "virifyOtpForSignup error",
    });
  }
};

export const sendOtp = async (req, res) => {
  //for reset password
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({
        success: false,
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in this email",
      });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;
    await user.save();

    await sendOtpOnEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "Otp send siccessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "send Otp error",
    });
  }
};

export const virifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!otp) {
      return res.status(401).json({
        success: false,
        message: "Otp is required",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in this email",
      });
    }

    if (otp != user.resetOtp) {
      return res.status(401).json({
        success: false,
        message: "InValied Otp",
      });
    }

    if (Date.now() > user.otpExpires) {
      return res.status(401).json({
        success: false,
        message: "Expire Otp",
      });
    }

    user.resetOtp = undefined;
    user.isOtpVerified = true;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Otp Virefy siccessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "virify Otp error",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword) {
      return res.status(401).json({
        success: false,
        message: "New Password is required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(401).json({
        success: false,
        message: "password  must be at least 6 characters.",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in this email",
      });
    }

    if (!user.isOtpVerified) {
      return res.status(401).json({
        success: false,
        message: "Your otp must be Verified for reset Password",
      });
    }

    const hastPassword = await bcrypt.hash(newPassword, 10);
    user.password = hastPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password Reset siccessfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "resetPassword error",
    });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, mobile, role, type } = req.body;

    if (type === "signup" && (!mobile || mobile.length !== 10)) {
      return res.status(400).json({
        success: false,
        message: "Mobile number must be 10 digits.",
      });
    }

    let user = await User.findOne({ email });

    if (!user && type === "login") {
      return res.status(400).json({
        success: false,
        message: "Please create your account.",
      });
    }

    if (type === "signup" && user && user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Account already exists with this email.",
      });
    }

    if (!user && type === "signup") {
      user = await User.create({
        fullName,
        email,
        mobile,
        role,
        isVerified: true,
      });
    }

    const token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
    });

    if (type == "login") await sendWelcom(user.email, user.fullName);

    return res.status(201).json({
      success: true,
      message: type === "signup" ? "Account created." : "Login successful.",
      user,
    });
  } catch (error) {
    console.error("googleAuth error:", error);
    return res.status(500).json({
      success: false,
      message: "googleAuth error",
    });
  }
};
