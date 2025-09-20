import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import {
  addItems,
  deleteItem,
  editItems,
  getItemByShop,
  rating,
  searchItem,
} from "../controllers/item.controller.js";
import upload from "../middlewares/multer.js";
const route = express.Router();

route.post("/add-item", upload.single("image"), isAuth, addItems);
route.put("/edit-item/:itemId", upload.single("image"), isAuth, editItems);
route.delete("/delete-item/:itemId", isAuth, deleteItem);
route.get("/get-items-by-shop/:shopId", isAuth, getItemByShop);
route.get("/search-items", isAuth, searchItem);
route.post("/rating", isAuth, rating);

export default route;
