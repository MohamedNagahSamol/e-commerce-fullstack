
import productmodule from "../module/productmodule.js";
import fs from "fs";
import cloud from "cloudinary";
import { validationResult } from "express-validator"; // ✅ إضافة validation

const cloudinary = cloud.v2;

const addProduct = async (req, res) => {
  if (!req.file) {
    return res.status(500).json({ message: "لم يتم رفع صورة", success: false });
  }

  try {
    // ✅ التحقق من المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", JSON.stringify(errors.array()));
      console.log("Received body:", JSON.stringify(req.body));
      if (req.file && req.file.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        message: errors.array()[0]?.msg || "بيانات غير صحيحة",
        errors: errors.array(),
      });
    }

    const imge = await cloudinary.uploader.upload(req.file.path);
    await productmodule.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: imge.secure_url,
    });
    res.status(201).json({ success: true, message: "product added" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  } finally {

    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.log("Failed to delete local file:", unlinkErr);
      }
    }
  }
};
const listProducts = async (req, res) => {
  try {
    const products = await productmodule.find({});
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};
const removeProduct = async (req, res) => {
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

    const product = await productmodule.findById(req.body.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "product not found" });
    }

    if (product.image) {
      try {
        const urlSegments = product.image.split('/');
        const filenameWithExt = urlSegments[urlSegments.length - 1];
        const publicId = filenameWithExt.split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudErr) {
        console.log("Failed to delete image from Cloudinary:", cloudErr);
      }
    }

    await productmodule.findByIdAndDelete(req.body.id);
    res.status(200).json({ success: true, message: "product removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message, success: false });
  }
};

export { addProduct, listProducts, removeProduct };
