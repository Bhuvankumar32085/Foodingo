import express from "express";
import {
  googleAuth,
  logout,
  resetPassword,
  sendOtp,
  signIn,
  signup,
  virifyOtp,
  virifyOtpForSignup,
} from "../controllers/auth.controller.js";
const route = express.Router();

route.post("/signup", signup);
route.post("/login", signIn);
route.get("/logout", logout);
route.post("/send-Otp", sendOtp);
route.post("/virify-Otp", virifyOtp);
route.put("/reset-password", resetPassword);
route.post("/virify-Otp-signup", virifyOtpForSignup);
route.post("/google-auth", googleAuth);

export default route;
