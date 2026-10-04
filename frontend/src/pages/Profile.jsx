import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../axios/axiosInstance";
import { User, Mail, Lock, LogOut, Edit2, Save, Package, Loader2 } from "lucide-react";
import moment from "moment";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosInstance.get("/api/user/profile");
        if (res.data.success) {
          setUserData(res.data.user);
          setFormData({ name: res.data.user.name, email: res.data.user.email });
        }
      } catch (err) {
        console.log("خطأ في جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserOrders = async () => {
      try {
        const res = await axiosInstance.post(`/api/order/userorders`, {});
        if (res.data.success) {
          const orderData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
          setUserOrders(orderData || []);
        }
      } catch (err) {
        console.log("خطأ في جلب الطلبات:", err);
      }
    };

    if (!Cookies.get("accessToken")) {
      navigate("/login");
    } else {
      fetchUserData();
      fetchUserOrders();
    }
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axiosInstance.post("/api/user/update-profile", formData);
      if (res.data.success) {
        setMessage("تم تحديث البيانات بنجاح ✅");
        setUserData(res.data.user);
        setIsEditing(false);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في التحديث");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (passwordData.newPassword.length < 8) {
      setError("يجب أن تكون كلمة المرور 8 أحرف على الأقل");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("كلمات المرور غير متطابقة");
      return;
    }

    try {
      const res = await axiosInstance.post("/api/user/change-password", {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      if (res.data.success) {
        setMessage("تم تغيير كلمة المرور بنجاح ✅");
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setIsChangingPassword(false);
        setTimeout(() => setMessage(""), 3000);
      } else {
        setError(res.data.message);
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في تغيير كلمة المرور");
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/user/logout");
      Cookies.remove("accessToken");
      navigate("/login");
    } catch (err) {
      console.log("خطأ في تسجيل الخروج:", err);
    }
  };

  const handleForgotPassword = async () => {
    setMessage("");
    setError("");
    setIsSendingReset(true);

    try {
      const res = await axiosInstance.post("/api/user/forgot-password", {
        email: userData?.email,
      });
      if (res.data.success) {
        setMessage("تم إرسال رابط تغيير كلمة المرور إلى بريدك الإلكتروني ✅");
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في إرسال البريد");
    } finally {
      setIsSendingReset(false);
    }
  };

  if (loading) {
    return (
      <section className="relative w-full min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-amber-400" />
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-slate-950 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-500/15 border border-red-500/30 rounded-2xl text-red-400 text-xs font-bold text-center">
            {error}
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10 space-y-2">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20">
            لوحة حساب العميل
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">الملف الشخصي</h1>
          <p className="text-slate-400 text-sm">مرحباً بك مجدداً، {userData?.name}</p>
        </div>

        {/* Tabs Bar */}
        <div className="flex gap-2.5 mb-8 justify-center flex-wrap">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "profile"
                ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <User className="w-4 h-4" />
            <span>البيانات الشخصية</span>
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "password"
                ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>كلمة المرور والأمان</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "orders"
                ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>طلباتي ({userOrders.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md text-right">
          {activeTab === "profile" && (
            <div>
              {!isEditing ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>تعديل البيانات</span>
                    </button>
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-slate-400">الاسم المسجل</p>
                        <h3 className="text-xl font-bold text-white mt-0.5">{userData?.name}</h3>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xl">
                        {userData?.name?.charAt(0)?.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-slate-400 block mb-1">البريد الإلكتروني</span>
                      <p className="text-base text-white font-mono flex items-center justify-end gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800" dir="ltr">
                        {userData?.email}
                        <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                      </p>
                    </div>

                    <div>
                      <span className="text-xs text-slate-400 block mb-1">نوع الحساب</span>
                      <span className="inline-block px-3 py-1 bg-amber-400/10 text-amber-400 rounded-lg text-xs font-bold border border-amber-400/20">
                        {userData?.role === "admin" ? "مدير نظام (Admin)" : "عميل مسجل (Customer)"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم بالكامل</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                      dir="ltr"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-[1.01]"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ التعديلات</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === "password" && (
            <div>
              {!isChangingPassword ? (
                <div className="space-y-6 text-center py-4">
                  <Lock className="w-12 h-12 text-amber-400 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white">تغيير كلمة المرور</h3>
                    <p className="text-slate-400 text-xs">
                      احرص على استخدام كلمة مرور قوية تحتوي على أحرف وأرقام ورموز.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold px-8 py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-105 transition-all"
                  >
                    تغيير كلمة المرور الآن
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة المرور الحالية</label>
                    <input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">تأكيد كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold py-3 rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg shadow-amber-500/20 hover:scale-[1.01]"
                    >
                      تحديث كلمة المرور
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>

                  <div className="pt-6 border-t border-slate-800/80 text-center">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={isSendingReset}
                      className="text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      {isSendingReset ? "جاري إرسال الرابط..." : "نسيت كلمة المرور؟ أرسل رابط إعادة التعيين لإيميلي"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              {userOrders.length === 0 ? (
                <div className="text-center py-8 space-y-4">
                  <Package className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-slate-400 text-sm">لم تقم بأي طلبات بعد</p>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-amber-300 transition-all cursor-pointer"
                  >
                    ابدأ التسوق الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-mono font-bold text-amber-400">
                          #{order._id?.slice(-8).toUpperCase()}
                        </span>
                        <p className="text-xs text-slate-400">
                          {moment(order.createdAt).format("YYYY-MM-DD HH:mm")}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-base font-black text-white font-mono">
                          ${order.amount?.toFixed(2) || "0.00"}
                        </span>
                        <div className="mt-1">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold ${
                              order.status === "DELIVERED"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : order.status === "ON THE WAY"
                                  ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                  : order.status === "PENDING"
                                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                            }`}
                          >
                            {order.status === "DELIVERED" && "تم التسليم ✅"}
                            {order.status === "ON THE WAY" && "جاري التوصيل 🚚"}
                            {(order.status === "CANCELED" || order.status === "CANCELLED") && "ملغي ❌"}
                            {order.status === "PENDING" && "قيد المراجعة ⏳"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-xs sm:text-sm font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج من الحساب</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
