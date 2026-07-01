import rateLimit from "express-rate-limit";

// Handler يوقف الطلب عند تجاوز الحد ويمنع وصوله للـ Controller
const rateLimitHandler = (req, res) => {
  return res.status(429).json({
    success: false,
    message: req.rateLimit?.message || "عدد كبير من الطلبات، حاول لاحقاً",
  });
};

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "عدد كبير من الطلبات، حاول مرة أخرى بعد 15 دقيقة",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // حماية من Brute Force - 100 محاولات فقط
  message: "عدد كبير من محاولات تسجيل الدخول، حاول مرة أخرى بعد 15 دقيقة",
  skipSuccessfulRequests: true, // لا تحسب المحاولات الناجحة
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

const cartLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  message: "عدد كبير من عمليات السلة، حاول مرة أخرى بعد دقيقة",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100, // منع spam الطلبات - 10 طلبات في الساعة فقط
  message: "عدد كبير من الطلبات، حاول مرة أخرى بعد ساعة",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "عدد كبير من الطلبات الإدارية، حاول مرة أخرى بعد 15 دقيقة",
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

export {
  generalLimiter,
  authLimiter,
  cartLimiter,
  orderLimiter,
  adminLimiter,
};
