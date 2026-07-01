
import Notification from "../module/notificationModule.js";


const getUserNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const getAllNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "notification not found" });
    }
    if (notification.userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "unauthorized access to this notification" });
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json({ success: true, message: "notification marked as read" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    res.status(200).json({ success: true, message: "all notifications marked as read" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "notification not found" });
    }
    if (notification.userId !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "unauthorized access to this notification" });
    }
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "notification deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const clearAllNotification = async (req, res) => {
  try {
    await Notification.deleteMany({ userId: req.user._id });
    res.status(200).json({ success: true, message: "all notifications deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

const deleteAllRead = async (req, res) => {
  try {
    const readNotifications = await Notification.find({ userId: req.user._id, isRead: true });
    await Promise.all(readNotifications.map((n) => Notification.findByIdAndDelete(n._id)));
    res.status(200).json({ success: true, message: "all read notifications deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export {
  getUserNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotification,
  deleteAllRead,
  getAllNotification
};







// const createNotifaction = async (userId, message, orderId, username) => {
//   try {
//     const notifaction = new Notifaction({ userId, message, orderId, username });
//     await notifaction.save();
//     return notifaction;
//   } catch (err) {
//     console.log(err);
//     throw new Error(err.message);
//   }
// };