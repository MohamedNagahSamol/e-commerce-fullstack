// ====================================
// 📦 Product Routes - تم تحديث Rate Limiting و Validation
// التعديل: إضافة adminLimiter و generalLimiter و Input Validation
// السبب: حماية admin routes وتصفح عام للمنتجات وبيانات صحيحة
// التاريخ: 2026-06-20
// ====================================

import express from "express";
import multer from "multer";
import { addProduct, listProducts, removeProduct } from "../controllers/productcontroller.js";
import { adminAuth } from "../middleware/authMiddleware.js";
import { adminLimiter, generalLimiter } from "../config/ratelimte.js";
import { addProductValidator, removeProductValidator } from "../config/validators.js"; // ✅ إضافة Validators

const productRouter = express.Router();

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Public route - يمكن تصفحها بدون login
productRouter.get("/list", generalLimiter, listProducts);

// Admin routes - حماية مشددة مع validation
productRouter.post("/add", adminLimiter, adminAuth, upload.single("image"), addProductValidator, addProduct);
productRouter.post("/remove", adminLimiter, adminAuth, removeProductValidator, removeProduct);

export default productRouter;
