// ====================================
// 📦 Order Routes - تم تحديث Rate Limiting و Validation
// التعديل: إضافة orderLimiter و adminLimiter و Input Validation
// السبب: منع spam الطلبات وحماية admin routes والتحقق من البيانات
// التاريخ: 2026-06-20
// ====================================

import express from "express";
import { placeOrder, verifyOrder, updateStatus, listOrders, userOrders } from "../controllers/ordercontroller.js";
import { requredAuth, adminAuth } from "../middleware/authMiddleware.js";
import { orderLimiter, adminLimiter } from "../config/ratelimte.js";
import {
  placeOrderValidator,
  verifyOrderValidator,
  updateStatusValidator,
} from "../config/validators.js"; // ✅ إضافة Validators

const orderRouter = express.Router();

// User order routes - حماية من spam الطلبات مع validation
orderRouter.post("/place", orderLimiter, requredAuth, placeOrderValidator, placeOrder);
orderRouter.post("/verify", orderLimiter, requredAuth, verifyOrderValidator, verifyOrder);
orderRouter.post("/userorders", requredAuth, userOrders);

// Admin routes - حد أعلى للإدمن مع validation
orderRouter.get("/list", adminLimiter, adminAuth, listOrders);
orderRouter.post("/status", adminLimiter, adminAuth, updateStatusValidator, updateStatus);

export default orderRouter;
