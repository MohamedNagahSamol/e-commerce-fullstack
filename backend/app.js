import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import "dotenv/config.js";
import corsOption from "./config/corsoption.js";
import productRouter from "./routes/productRoutes.js";
import userrouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import helmet from "helmet";

const app = express();
connectDB();
import cookieParser from "cookie-parser";
app.use(cookieParser());
import cloud from "cloudinary";
const cloudinary = cloud.v2;

app.use(helmet());
app.use(cors(corsOption));
const sanitize = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const sanitizedKey = key.replace(/^\$/, "_").replace(/\./g, "_");
    acc[sanitizedKey] = typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])
      ? sanitize(obj[key]) : obj[key];
    return acc;
  }, Array.isArray(obj) ? [] : {});
};
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  next();
});

cloudinary.config({
  cloud_name: process.env.cloud_Name,
  api_key: process.env.API_key,
  api_secret: process.env.API_secret,
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin", adminRoutes);
app.use("/api/order", orderRouter);
app.use("/api/user", userrouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRoutes);
app.use("/api/notification", notificationRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", success: false });
});

app.listen(process.env.PORT, () => {
  console.log(process.env.PORT);
});
