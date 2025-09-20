import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  acceptAssignment,
  deleteOrder,
  getCurrentOrder,
  getDeliveryBoyAssignment,
  getOrderById,
  getOwnerOrder,
  getTodayDeliveries,
  getUserOrder,
  placeOredr,
  sendDeliveredOtpcontroller,
  updateStatus,
  verifyDeliveredOtpcontroller,
  verifyPayment,
} from "../controllers/order.controller.js";
const route = express.Router();

route.post("/place-order", isAuth, placeOredr);
route.delete("/delete", isAuth, deleteOrder);
route.post("/verify-payment", isAuth, verifyPayment);
route.get("/get-order", isAuth, getUserOrder);
route.get("/get-owner-order", isAuth, getOwnerOrder);
route.put("/update-status", isAuth, updateStatus);
route.get("/get-assignment", isAuth, getDeliveryBoyAssignment);
route.get("/accept-order/:assignmentId", isAuth, acceptAssignment);
route.get("/get-current-order", isAuth, getCurrentOrder); //for delivery boy
route.get("/get-order/:orderId", isAuth, getOrderById); //for user
route.post("/delivered-otp", isAuth, sendDeliveredOtpcontroller); //for delivery boy
route.post("/verify-delivered-otp", isAuth, verifyDeliveredOtpcontroller); //for delivery boy
route.get("/get-today-delivery", isAuth, getTodayDeliveries);

export default route;
