// ====================================
// 👨‍💼 Admin Controllers - تم التحديث
// التعديل: إضافة Input Validation
// السبب: التحقق من صحة IDs قبل العمليات الحساسة
// التاريخ: 2026-06-20
// ====================================

import usermodule from "../module/usermodule.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator"; // ✅ إضافة validation

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usermodule.findOne({ email });
    if (!user) return res.status(404).json({ message: "user not found", success: false });
    if (user.role !== "admin") return res.status(403).json({ message: "not admin", success: false });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ message: "wrong password", success: false });
    const adminToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    res.status(200).json({ adminToken: adminToken, user: { name: user.name, email: user.email }, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await usermodule.find().select("-password");
    res.status(200).json({ data: users, success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};
const deleteUser = async (req, res) => {
  try {
    // ✅ التحقق من المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "بيانات غير صحيحة",
        errors: errors.array(),
      });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "لا يمكنك حذف حسابك الخاص", success: false });
    }

    const deletedUser = await usermodule.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "user not found", success: false });
    }
    res.status(200).json({ message: "user deleted", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};
const MakeAdmin = async (req, res) => {
  try {
    // ✅ التحقق من المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "بيانات غير صحيحة",
        errors: errors.array(),
      });
    }

    const updatedUser = await usermodule.findByIdAndUpdate(req.params.id, { role: "admin" });
    if (!updatedUser) {
      return res.status(404).json({ message: "user not found", success: false });
    }
    res.status(200).json({ message: "user updated to admin", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};
const MakeUser = async (req, res) => {
  try {
    // ✅ التحقق من المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "بيانات غير صحيحة",
        errors: errors.array(),
      });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "لا يمكنك تغيير دورك الخاص", success: false });
    }

    const updatedUser = await usermodule.findByIdAndUpdate(req.params.id, { role: "user" });
    if (!updatedUser) {
      return res.status(404).json({ message: "user not found", success: false });
    }
    res.status(200).json({ message: "admin updated to user", success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};
export { adminLogin, getAllUsers, deleteUser, MakeAdmin, MakeUser };

// const adminLogout = (req, res) => {
//   try {
//     const cookies = req.cookies.adminToken;
//     if (!cookies) {
//       return res.status(204).json({ message: "Unauthorized", success: false });
//     }
//     res.clearCookie("adminToken", {
//       httpOnly: true,
//     });
//     res.status(200).json({ message: "logout successfuly", success: true });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message, success: false });
//   }
// };
