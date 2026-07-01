import express from "express";
const notificationRoutes = express.Router();
import { requredAuth, adminAuth } from "../middleware/authMiddleware.js";
import { generalLimiter } from "../config/ratelimte.js";
import { param } from "express-validator";
import {
  getUserNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotification,
  deleteAllRead,
  getAllNotification,
} from "../controllers/notificationControllers.js";

notificationRoutes.use(generalLimiter);

notificationRoutes.get("/get", requredAuth, getUserNotification);
notificationRoutes.get("/getAll", adminAuth, getAllNotification);
notificationRoutes.post("/markasread/:id", requredAuth, param("id").isMongoId(), markAsRead);
notificationRoutes.post("/markallasread", requredAuth, markAllAsRead);
notificationRoutes.delete("/delete/:id", requredAuth, param("id").isMongoId(), deleteNotification);
notificationRoutes.delete("/clearall", requredAuth, clearAllNotification);
notificationRoutes.delete("/deleteallread", requredAuth, deleteAllRead);

export default notificationRoutes;
