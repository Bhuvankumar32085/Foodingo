import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ConnectDB } from "./config/DB.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import shopeRoute from "./routes/shop.route.js";
import itemRoute from "./routes/item.route.js";
import orderRoute from "./routes/order.route.js";
import { Server } from "socket.io";
import http from "http";
import { socketHandler } from "./socket.js";
import path from "path"; //

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const io = new Server(server, {
  cors: {
    origin: "https://foodingo-g39f.onrender.com",
    credentials: true,
    methods: ["POST", "PUT", "GET", "DELETE"],
  },
});
app.set("io", io);

app.use(
  cors({
    origin: "https://foodingo-9rf7.onrender.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const __dirname = path.resolve(); //

//routes
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/shop", shopeRoute);
app.use("/api/item", itemRoute);
app.use("/api/order", orderRoute);

app.use(express.static(path.join(__dirname, "frontend/dist"))); //
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
}); //

socketHandler(io);

ConnectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
  });
});
