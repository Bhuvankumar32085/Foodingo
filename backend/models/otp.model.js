import mongoose from "mongoose";
const { Schema } = mongoose;

const otpSchems = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchems);
export default Otp;
