// ====================================
// 📦 Order Controller - تم التحديث
// التعديل: إضافة Input Validation
// السبب: التحقق من صحة بيانات الطلبات
// التاريخ: 2026-06-20
// ====================================

import usermodule from "../module/usermodule.js";
import ordermodule from "../module/ordermodule.js";
import Stripe from "stripe";
import Notification from "../module/notificationModule.js";
import productmodule from "../module/productmodule.js";
import cartModule from "../module/cartmodule.js"; // ✅ إضافة Cart Module
import { Resend } from "resend";
import { validationResult } from "express-validator"; // ✅ إضافة validation

const resend = new Resend(process.env.RESEND_API_KEY);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
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

    const line_items = [];
    let calculatedAmount = 0;

    for (const item of req.body.items) {
      const product = await productmodule.findById(item._id);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} not found` });
      }
      line_items.push({
        price_data: {
          currency: "egp",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: item.quantity,
      });
      calculatedAmount += product.price * item.quantity;
    }

    line_items.push({
      price_data: {
        currency: "egp",
        product_data: {
          name: "Delivary Charges",
        },
        unit_amount: 50 * 100,
      },
      quantity: 1,
    });
    calculatedAmount += 50;

    const newOrder = await ordermodule.create({
      userId: req.user._id,
      name: req.user.name,
      items: req.body.items,
      amount: calculatedAmount,
      address: req.body.address,
      status: "PENDING",
      payment: false,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(201).json({ success: true, session: session.url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success, sessionId } = req.body;
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

    if (success === "true") {
      if (!sessionId) {
        return res.status(400).json({ success: false, message: "Missing Stripe Session ID" });
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === "paid") {
        const isExistPayment = await ordermodule.findById(orderId);
        if (isExistPayment.payment) return res.status(200).json({ success: true, message: "already verified" });
        await ordermodule.findByIdAndUpdate(orderId, { payment: true });

        // ====================================
        // 🛒 تحديث: مسح السلة من Cart Collection الجديد
        // الكود القديم: await usermodule.findByIdAndUpdate(req.user._id, { cartData: {} });
        // الكود الجديد: await cartModule.findOneAndUpdate({userId: req.user._id}, {items: []});
        // السبب: نقل السلة إلى Collection منفصل
        // ====================================
        await cartModule.findOneAndUpdate(
          { userId: req.user._id },
          { items: [] }
        );

        const user = await usermodule.findById(req.user._id);

        await Notification.create({
          userId: req.user._id,
          message: "تمت عمليه الدفع بنجاح جاري التحقق منى الطلبيه و ارسالها في خلال اسبوع",
          username: req.user.name,
        });
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: user.email,
          subject: "تمت عمليه الدفع بنجاح",
          html: `<h1>مرحبا بك يا ${user.name}</h1><p>تمت عمليه الدفع بنجاح جاري التحقق منى الطلبيه و ارسالها في خلال اسبوع</p>`,
        });
        res.status(200).json({ success: true, message: "payment success" });
      } else {
        res.status(400).json({ success: false, message: "payment verification failed on stripe" });
      }
    } else {
      await ordermodule.findByIdAndDelete(orderId);
      res.status(400).json({ success: false, message: "payment failed" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
const userOrders = async (req, res) => {
  try {
    const orders = await ordermodule.find({ userId: req.user._id });
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await ordermodule.find({});
    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
const updateStatus = async (req, res) => {
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

    const order = await ordermodule.findByIdAndUpdate(req.body.orderId, { status: req.body.newStatus });
    const user = await usermodule.findById(order.userId);

    await Notification.create({
      userId: user._id,
      message: "تم تحديث حاله الاوردر تاكد من طلبك من خانه الطلبات",
      username: user.name,
    });
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "تمت تحديث الطلب",
      html: `<h1>مرحبا بك يا ${user.name}</h1><p>تم تحديث حاله الطلب ادخل علي الموقع و علي خانه الطلبات لاكتشاف كل جديد</p>`,
    });
    res.status(200).json({ success: true, message: "status updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
