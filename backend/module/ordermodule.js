import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, required: true },
    items: { type: [], required: true },
    amount: { type: Number, required: true },
    address: { type: {}, required: true },
    status: {
      type: String,
      enum: ["PENDING", "ON THE WAY", "DELIVERED","CANCELED"],
      default: "PENDING",
    },
    payment: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const ordermodule = mongoose.models.order || mongoose.model("order", orderSchema);

export default ordermodule;
