

import { body, param } from "express-validator";

// ========================================
// 🛒 Cart Validators
// ========================================

const addToCartValidator = [
  body("id")
    .notEmpty()
    .withMessage("معرف المنتج مطلوب")
    .isMongoId()
    .withMessage("معرف المنتج غير صحيح")
    .trim()
    .escape(),
];

const removeFromCartValidator = [
  body("id")
    .optional()
    .isMongoId()
    .withMessage("معرف المنتج غير صحيح")
    .trim()
    .escape(),
];

// ========================================
// 📦 Product Validators
// ========================================

const addProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("اسم المنتج مطلوب")
    .isLength({ min: 2, max: 200 })
    .withMessage("اسم المنتج يجب أن يكون بين 2 و 200 حرف")
    .trim()
    .escape(),

  body("description")
    .notEmpty()
    .withMessage("وصف المنتج مطلوب")
    .isLength({ min: 3, max: 2000 })
    .withMessage("وصف المنتج يجب أن يكون بين 3 و 2000 حرف")
    .trim(),

  body("price")
    .notEmpty()
    .withMessage("سعر المنتج مطلوب")
    .isFloat({ min: 0.01 })
    .withMessage("السعر يجب أن يكون رقم أكبر من 0")
    .toFloat(),

  body("category")
    .notEmpty()
    .withMessage("فئة المنتج مطلوبة")
    .isIn(["Men", "Women", "Kids", "Electronics", "Cosmetics"])
    .withMessage("الفئة يجب أن تكون: Men, Women, Kids, Electronics, أو Cosmetics")
    .trim()
    .escape(),
];

const removeProductValidator = [
  body("id")
    .notEmpty()
    .withMessage("معرف المنتج مطلوب")
    .isMongoId()
    .withMessage("معرف المنتج غير صحيح")
    .trim()
    .escape(),
];

// ========================================
// 🛍️ Order Validators
// ========================================

const placeOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("يجب أن تحتوي الطلبية على منتج واحد على الأقل"),

  body("items.*.name")
    .notEmpty()
    .withMessage("اسم المنتج مطلوب")
    .trim()
    .escape(),

  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("الكمية يجب أن تكون رقم أكبر من 0")
    .toInt(),

  body("address")
    .notEmpty()
    .withMessage("العنوان مطلوب")
    .isObject()
    .withMessage("العنوان يجب أن يكون object"),

  body("address.name")
    .notEmpty()
    .withMessage("الاسم الأول مطلوب")
    .isLength({ min: 2, max: 50 })
    .withMessage("الاسم الأول يجب أن يكون بين 2 و 50 حرف")
    .trim()
    .escape(),

  body("address.city")
    .notEmpty()
    .withMessage("المدينة مطلوبة")
    .isLength({ min: 2, max: 100 })
    .withMessage("المدينة يجب أن تكون بين 2 و 100 حرف")
    .trim()
    .escape(),

  body("address.phone")
    .notEmpty()
    .withMessage("رقم الهاتف مطلوب")
    .isMobilePhone()
    .withMessage("رقم الهاتف غير صحيح")
    .trim(),
];

const verifyOrderValidator = [
  body("orderId")
    .notEmpty()
    .withMessage("معرف الطلب مطلوب")
    .isMongoId()
    .withMessage("معرف الطلب غير صحيح")
    .trim()
    .escape(),

  body("success")
    .notEmpty()
    .withMessage("حالة الدفع مطلوبة")
    .isIn(["true", "false"])
    .withMessage("حالة الدفع يجب أن تكون true أو false"),

  body("sessionId")
    .optional()
    .isString()
    .withMessage("معرف الجلسة يجب أن يكون نص")
    .trim(),
];

const updateStatusValidator = [
  body("orderId")
    .notEmpty()
    .withMessage("معرف الطلب مطلوب")
    .isMongoId()
    .withMessage("معرف الطلب غير صحيح")
    .trim()
    .escape(),

  body("newStatus")
    .notEmpty()
    .withMessage("الحالة الجديدة مطلوبة")
    .isIn(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .withMessage("الحالة يجب أن تكون: PENDING, PROCESSING, SHIPPED, DELIVERED, أو CANCELLED")
    .trim()
    .escape(),
];

// ========================================
// 👤 User Validators (إضافية)
// ========================================

const updateProfileValidator = [
  body("name")
    .notEmpty()
    .withMessage("الاسم مطلوب")
    .isLength({ min: 2, max: 100 })
    .withMessage("الاسم يجب أن يكون بين 2 و 100 حرف")
    .trim()
    .escape(),

  body("email")
    .notEmpty()
    .withMessage("البريد الإلكتروني مطلوب")
    .isEmail()
    .withMessage("البريد الإلكتروني غير صحيح")
    .normalizeEmail(),
];

// ========================================
// 👨‍💼 Admin Validators
// ========================================

const adminIdValidator = [
  param("id")
    .notEmpty()
    .withMessage("معرف المستخدم مطلوب")
    .isMongoId()
    .withMessage("معرف المستخدم غير صحيح")
    .trim()
    .escape(),
];

// ========================================
// Export All Validators
// ========================================

export {
  // Cart
  addToCartValidator,
  removeFromCartValidator,
  // Product
  addProductValidator,
  removeProductValidator,
  // Order
  placeOrderValidator,
  verifyOrderValidator,
  updateStatusValidator,
  // User
  updateProfileValidator,
  // Admin
  adminIdValidator,
};
