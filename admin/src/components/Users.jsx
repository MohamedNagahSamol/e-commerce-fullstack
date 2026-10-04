import { useState, useEffect } from "react";
import axiosinstance from "../axios/axiosInstance";
import { Trash2, User, ShieldCheck, Loader2, Users as UsersIcon } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchUsers = async () => {
      try {
        const res = await axiosinstance.get(`/api/admin/all`, { signal: controller.signal });
        if (res.data.success) {
          setUsers(res.data.data || []);
        } else {
          toast.error(res.data.message || "فشل جلب المستخدمين");
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(err.message || "حدث خطأ أثناء تحميل المستخدمين");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    return () => controller.abort();
  }, []);

  const handleDelete = async (userId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المستخدم نهائياً؟")) return;
    try {
      const res = await axiosinstance.delete(`/api/admin/delete/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        toast.success("تم حذف المستخدم بنجاح");
      } else {
        toast.error(res.data.message || "فشل حذف المستخدم");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء حذف المستخدم");
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      const res = await axiosinstance.post(`/api/admin/makeadmin/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role: "admin" } : user)));
        toast.success("تم ترقية المستخدم إلى مشرف بنجاح");
      } else {
        toast.error(res.data.message || "فشلت الترقية");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    }
  };

  const handleMakeUser = async (userId) => {
    try {
      const res = await axiosinstance.post(`/api/admin/makeuser/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role: "user" } : user)));
        toast.success("تم تحويل المشرف إلى مستخدم عادي");
      } else {
        toast.error(res.data.message || "فشل تغيير الدور");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ");
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white md:pl-64 pt-20 md:pt-10 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-900 text-right">
          <h1 className="text-2xl sm:text-3xl font-black text-white">إدارة المستخدمين والصلاحيات</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            عرض وتعيين صلاحيات المديرين وحسابات العملاء المسجلين في المتجر ({users.length} مستخدم).
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            <p className="text-sm text-slate-400 font-bold">جاري تحميل قائمة المستخدمين...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md mx-auto space-y-3">
            <UsersIcon className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">لا يوجد مستخدمين مسجلين</h3>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xl text-right space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                        user.role === "admin"
                          ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                          : "bg-blue-400/10 text-blue-400 border-blue-400/30"
                      }`}
                    >
                      {user.role === "admin" ? "مدير نظام (Admin)" : "عميل (User)"}
                    </span>

                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 font-bold text-xs">
                      {user.name?.charAt(0) || "U"}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{user.name || "مستخدم"}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5" dir="ltr">
                      {user.email}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-2">
                      تاريخ التسجيل: {moment(user.createdAt).format("YYYY-MM-DD")}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                  {user.role !== "admin" ? (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-amber-400/10 border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-slate-950 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>ترقية لمشرف</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMakeUser(user._id)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500 hover:text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>تحويل لمستخدم</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                    title="حذف المستخدم"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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

export default Users;
