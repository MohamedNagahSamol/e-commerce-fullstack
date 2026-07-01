import axiosinstence from "../axios/axiosInstance";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Bell, Trash2, CheckCircle } from "lucide-react";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchNotifications = async () => {
      try {
        const res = await axiosinstence.get("/api/notification/getAll", { signal });
        if (res.data.success) {
          setNotifications(res.data.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    };

    fetchNotifications();

    return () => {
      controller.abort();
    };
  }, []);
  const deleteNotification = async (id) => {
    try {
      const res = await axiosinstence.delete(`/api/notification/delete/${id}`);
      if (res.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };
  const markAsRead = async (id) => {
    try {
      const res = await axiosinstence.post(`/api/notification/markasread/${id}`);
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };
  const markAllAsRead = async () => {
    try {
      const res = await axiosinstence.post(`/api/notification/markallasread`);
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };
  const clearAllNotifications = async () => {
    try {
      const res = await axiosinstence.delete(`/api/notification/clearall`);
      if (res.data.success) {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };
  const deleteAllRead = async () => {
    try {
      await axiosinstence.delete(`/api/notification/deleteallread`);
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Error deleting read notifications:", error);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <section className="bg-linear-to-r   from-teal-900 via-teal-800 to-amber-900 min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Notifications</h1>
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          Mark All as Read
        </button>
        <button
          onClick={deleteAllRead}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Delete All Read
        </button>
        <button
          onClick={clearAllNotifications}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Trash2 className="w-5 h-5" />
          Clear All
        </button>
      </div>
      {notifications.length === 0 ? (
        <p className="text-center text-amber-500 text-xl">No notifications yet..</p>
      ) : (
        <div className="grid gap-4">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-lg shadow-md flex justify-between items-center ${n.isRead ? "bg-amber-900" : "bg-amber-600"}`}
            >
              <div>
                <p className="text-white">{n.message}</p>
                <p className="text-white ">
                  userName:{" " + n.username},userId:{" " + n.userId}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!n.isRead && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Read
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(n._id)}
                  className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Notification;
