// ====================================
// 👨‍💼 Admin Routes - تم تحديث Rate Limiting و Validation
// التعديل: استخدام authLimiter للـ login و adminLimiter لباقي العمليات + Validation
// السبب: حماية من Brute Force على admin login والتحقق من IDs
// الكود القديم: limiter عام على كل الـ routes
// التاريخ: 2026-06-20
// ====================================

import express from "express";
import { adminLogin, getAllUsers, deleteUser, MakeAdmin, MakeUser } from "../controllers/admincontrollers.js";
import { authLimiter, adminLimiter } from "../config/ratelimte.js";
import { adminAuth } from "../middleware/authMiddleware.js";
import { adminIdValidator } from "../config/validators.js"; // ✅ إضافة Validators

const adminRoutes = express.Router();

// Admin login - حماية مشددة ضد Brute Force
adminRoutes.post("/login", authLimiter, adminLogin);

// باقي admin routes - حد أعلى للعمليات مع validation
adminRoutes.use(adminLimiter);

adminRoutes.get("/all", adminAuth, getAllUsers);
adminRoutes.delete("/delete/:id", adminAuth, adminIdValidator, deleteUser);
adminRoutes.post("/makeadmin/:id", adminAuth, adminIdValidator, MakeAdmin);
adminRoutes.post("/makeuser/:id", adminAuth, adminIdValidator, MakeUser);

export default adminRoutes;
