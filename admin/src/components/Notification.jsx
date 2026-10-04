import axiosinstance from "../axios/axiosInstance";
import { useEffect, useState } from "react";
import { Loader2, Bell, Trash2, CheckCircle2, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchNotifications = async () => {
      try {
        const res = await axiosinstance.get("/api/notification/getAll", { signal: controller.signal });
        if (res.data.success) {
          setNotifications(res.data.data || []);
        }
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching notifications:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    return () => controller.abort();
  }, []);

  const deleteNotification = async (id) => {
    try {
      const res = await axiosinstance.delete(`/api/notification/delete/${id}`);
      if (res.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        toast.success("تم حذف الإشعار");
      }
    } catch {
      toast.error("فشل حذف الإشعار");
    }
  };

  const markAsRead = async (id) => {
    try {
      const res = await axiosinstance.post(`/api/notification/markasread/${id}`);
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
        toast.success("تم التحديد كمقروء");
      }
    } catch {
      toast.error("فشل التحديث");
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await axiosinstance.post(`/api/notification/markallasread`);
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        toast.success("تم تحديد جميع الإشعارات كمقروءة");
      }
    } catch {
      toast.error("فشل التحديث");
    }
  };

  const clearAllNotifications = async () => {
    if (!window.confirm("هل أنت متأكد من مسح جميع الإشعارات في النظام؟")) return;
    try {
      const res = await axiosinstance.delete(`/api/notification/clearall`);
      if (res.data.success) {
        setNotifications([]);
        toast.success("تم مسح كافة الإشعارات");
      }
    } catch {
      toast.error("فشل المسح");
    }
  };

  const deleteAllRead = async () => {
    try {
      await axiosinstance.delete(`/api/notification/deleteallread`);
      setNotifications((prev) => prev.filter((n) => !n.isRead));
      toast.success("تم حذف الإشعارات المقروءة");
    } catch {
      toast.error("فشل الحذف");
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white md:pl-64 pt-20 md:pt-10 pb-16 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900 text-right">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">مركز إشعارات الإدارة</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              متابعة تنبيهات الطلبات الجديدة وتسجيلات المستخدمين في المتجر.
            </p>
          </div>

          {notifications.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
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
                className="flex items-center gap-1.5 px-3.5 py-2 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>مسح الكل</span>
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            <p className="text-sm text-slate-400 font-bold">جاري تحميل الإشعارات...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md mx-auto space-y-3">
            <Bell className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">لا توجد إشعارات حالياً</h3>
            <p className="text-xs text-slate-400">ستظهر هنا أي تنبيهات جديدة خاصة بنشاط المتجر.</p>
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
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                      <span>المستخدم: {n.username || "غير محدد"}</span>
                      {n.userId && <span>ID: {n.userId.slice(-6)}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>كمقروء</span>
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
