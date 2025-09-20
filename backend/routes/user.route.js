import express from "express";
import {
  addAndEditLocation,
  getCurrUser,
  updateUserLocation,
} from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";
const route = express.Router();

route.get("/current-user", isAuth, getCurrUser);
route.post("/add-location", isAuth, addAndEditLocation);
route.post("/update-location", isAuth, updateUserLocation);

export default route;
