import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchems = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
    },
    mobile: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      required: true,
    },
    resetOtp: {
      type: String,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
    otpExpires: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    //
    city: {
      type: String,
    },
    address: {
      type: String,
    },
    state: {
      type: String,
    },
    district: {
      type: String,
    },
    location: {
      //geojson formate me h ye location
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    socketId: {
      type: String,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchems.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchems);
export default User;

// geojson formate wale attribute pr hum $near by me jasi query laga sakte h
