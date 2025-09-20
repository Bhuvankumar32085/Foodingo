import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  createShop,
  editShop,
  getShop,
  getShopByCity,
} from "../controllers/shop.controllers.js";
import upload from "../middlewares/multer.js";
const route = express.Router();

route.post("/create", upload.single("image"), isAuth, createShop);
route.post("/edit", upload.single("image"), isAuth, editShop);
route.get("/get", isAuth, getShop);
route.get("/get-by-city/:city", isAuth, getShopByCity);

export default route;
