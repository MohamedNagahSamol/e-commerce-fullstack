import cartModule from "../module/cartmodule.js";
import productmodule from "../module/productmodule.js";
import { validationResult } from "express-validator";

const addToCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "بيانات غير صحيحة",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    const product = await productmodule.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "المنتج غير موجود" });
    }

    let cart = await cartModule.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await cartModule.create({
        userId: req.user._id,
        items: [{ productId: id, quantity: 1 }],
      });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === id);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({ productId: id, quantity: 1 });
      }

      await cart.save();
    }

    res.status(201).json({ success: true, message: "تمت الإضافة للسلة" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "بيانات غير صحيحة",
        errors: errors.array(),
      });
    }

    const { id } = req.body;

    let cart = await cartModule.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "السلة فارغة" });
    }

    if (id) {
      const itemIndex = cart.items.findIndex((item) => item.productId.toString() === id);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity -= 1;

        if (cart.items[itemIndex].quantity <= 0) {
          cart.items.splice(itemIndex, 1);
        }
      }
    } else {
      cart.items = [];
    }

    await cart.save();

    res.status(200).json({
      success: true,
      message: "تم الحذف",
      cartData: cart.items,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

const getCart = async (req, res) => {
  try {
    let cart = await cartModule.findOne({ userId: req.user._id });

    if (!cart) {
      cart = await cartModule.create({
        userId: req.user._id,
        items: [],
      });
    }

    // تحويل Array إلى Object للتوافق مع Frontend
    // Frontend يتوقع: { "productId": quantity }
    const cartData = {};
    cart.items.forEach((item) => {
      const productId = item.productId.toString();
      cartData[productId] = item.quantity;
    });

    res.status(200).json({ success: true, cartData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

const clearCart = async (req, res) => {
  try {
    let cart = await cartModule.findOne({ userId: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: "السلة فارغة بالفعل" });
    }

    const oldCart = [...cart.items];
    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      message: "تم مسح السلة",
      cartData: oldCart,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

export { addToCart, removeFromCart, getCart, clearCart };
