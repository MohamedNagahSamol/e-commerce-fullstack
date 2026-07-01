import mongoose from "mongoose";

const notifactionSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "order" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    username: { type: String, required: true },
  },
  { timestamps: true },
);
const Notifaction = mongoose.models.Notifaction || mongoose.model("Notifaction", notifactionSchema);
export default Notifaction;
