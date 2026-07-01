import {
  loginUser,
  logOut,
  refresh,
  register,
  getUserProfile,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/usercontroller.js";
import express from "express";
import { authLimiter, generalLimiter } from "../config/ratelimte.js";
import { Check } from "../config/checksivalid.js";
import { updateProfileValidator } from "../config/validators.js";
import { requredAuth } from "../middleware/authMiddleware.js";
import { body } from "express-validator";

const userrouter = express.Router();

// Routes حساسة - حماية مشددة من Brute Force (5 محاولات/15 دقيقة)
userrouter.post("/register", authLimiter, Check, register);
userrouter.post("/login", authLimiter, Check, loginUser);
userrouter.post("/forgot-password", authLimiter, forgotPassword);
userrouter.post("/reset-password", authLimiter, body("newPassword").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/), resetPassword);

// Routes عادية
userrouter.use(generalLimiter);

userrouter.post("/logout", logOut);
userrouter.post("/refresh", refresh);
userrouter.get("/profile", requredAuth, getUserProfile);
userrouter.post("/update-profile", Check, requredAuth, updateProfileValidator, updateUserProfile);
userrouter.post("/change-password", body("newPassword").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/), requredAuth, changePassword);

export default userrouter;
