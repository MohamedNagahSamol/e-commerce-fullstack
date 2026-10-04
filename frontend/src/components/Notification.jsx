import axiosInstance from "../axios/axiosInstance";
import { useEffect, useState } from "react";
import { Loader2, Bell, Trash2, CheckCircle2, CheckCheck } from "lucide-react";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchNotifications = async () => {
      try {
        const res = await axiosInstance.get("/api/notification/get", { signal: controller.signal });
        if (res.data.success) {
          setNotifications(res.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    return () => controller.abort();
  }, []);

  const deleteNotification = async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/notification/delete/${id}`);
      if (res.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await axiosInstance.post(`/api/notification/markasread/${id}`);
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await axiosInstance.post(`/api/notification/markallasread`);
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const clearAllNotifications = async () => {
    if (!window.confirm("هل أنت متأكد من مسح جميع الإشعارات؟")) return;
    try {
      const res = await axiosInstance.delete(`/api/notification/clearall`);
      if (res.data.success) {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  const deleteAllRead = async () => {
    try {
      const readNotifications = notifications.filter((n) => n.isRead);
      await Promise.all(readNotifications.map((n) => axiosInstance.delete(`/api/notification/delete/${n._id}`)));
      setNotifications((prev) => prev.filter((n) => !n.isRead));
    } catch (error) {
      console.error("Error deleting read notifications:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-950 text-white">
        <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <section className="bg-slate-950 min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-900 text-right">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">مركز الإشعارات</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              تابع تحديثات طلباتك والعروض الحصرية أولاً بأول.
            </p>
          </div>

          {/* Action buttons */}
          {notifications.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>تحديد الكل كمقروء</span>
              </button>
              <button
                onClick={deleteAllRead}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                <span>حذف المقروء</span>
              </button>
              <button
                onClick={clearAllNotifications}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الكل</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">لا توجد إشعارات جديدة حالياً</h3>
            <p className="text-slate-400 text-xs">
              سنقوم بإشعارك بأي تحديثات فورية حول حالة شحن طلباتك والعروض الجديدة.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-right backdrop-blur-md ${
                  n.isRead
                    ? "bg-slate-900/40 border-slate-800/60 text-slate-300"
                    : "bg-slate-900/80 border-amber-400/30 text-white shadow-lg shadow-amber-500/5"
                }`}
              >
                <div className="flex items-start gap-3 w-full sm:w-auto">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      n.isRead
                        ? "bg-slate-800 text-slate-400"
                        : "bg-amber-400/20 border border-amber-400/30 text-amber-400"
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {n.isRead ? "مقروء" : "إشعار جديد"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تحديد كمقروء</span>
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n._id)}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer"
                    title="حذف الإشعار"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Notification;
