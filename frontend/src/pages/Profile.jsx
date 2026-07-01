import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "../axios/axiosInstance";
import { User, Mail, Lock, LogOut, Edit2, Save } from "lucide-react";
import moment from "moment"
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

  // التحقق من تسجيل الدخول
  useEffect(() => {
    // جلب بيانات المستخدم
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
    // جلب طلبات المستخدم
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

  // تحديث البيانات الشخصية
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

  // تغيير كلمة المرور
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

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
      }
      if (!res.data.success) {
        setError(res.data.message);
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ في تغيير كلمة المرور");
    }
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/user/logout");
      Cookies.remove("accessToken");
      navigate("/login");
    } catch (err) {
      console.log("خطأ في تسجيل الخروج:", err);
    }
  };

  // إرسال رابط تغيير كلمة المرور عبر البريد
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
      <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-950 text-white py-24 px-6 sm:px-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none"></div>
        <div className="relative z-10 text-center">
          <div className="animate-spin w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-xl">جاري التحميل...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-950 text-white py-24 px-6 sm:px-10">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* الرسائل */}
        {message && (
          <div className="mb-6 p-4 bg-green-500/30 border border-green-400 rounded-2xl text-green-200">{message}</div>
        )}
        {error && <div className="mb-6 p-4 bg-red-500/30 border border-red-400 rounded-2xl text-red-200">{error}</div>}

        {/* رأس الصفحة */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-semibold mb-4">حسابي الشخصي</h2>
          <p className="text-amber-400 text-lg">مرحباً بك {userData?.name}</p>
        </div>

        {/* التابات */}
        <div className="flex gap-4 mb-8 flex-wrap justify-center">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              activeTab === "profile"
                ? "bg-linear-to-r from-amber-500 to-yellow-500 text-black"
                : "bg-white/10 border border-white/20 hover:bg-white/20"
            }`}
          >
            <User className="w-5 h-5 inline mr-2" />
            البيانات الشخصية
          </button>

          <button
            onClick={() => setActiveTab("password")}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              activeTab === "password"
                ? "bg-linear-to-r from-amber-500 to-yellow-500 text-black"
                : "bg-white/10 border border-white/20 hover:bg-white/20"
            }`}
          >
            <Lock className="w-5 h-5 inline mr-2" />
            كلمة المرور
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
              activeTab === "orders"
                ? "bg-linear-to-r from-amber-500 to-yellow-500 text-black"
                : "bg-white/10 border border-white/20 hover:bg-white/20"
            }`}
          >
            📦 طلباتي
          </button>
        </div>

        {/* محتوى التابات */}
        <div className="space-y-6">
          {/* تاب البيانات الشخصية */}
          {activeTab === "profile" && (
            <div className="bg-white/10 border border-white/20 backdrop-blur-md p-8 rounded-3xl shadow-lg">
              {!isEditing ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-linear-to-r from-teal-500 to-amber-400 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">الاسم</p>
                      <p className="text-2xl font-semibold">{userData?.name}</p>
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-6">
                    <p className="text-gray-300 text-sm mb-2">البريد الإلكتروني</p>
                    <p className="text-xl flex items-center gap-3">
                      <Mail className="w-5 h-5 text-amber-400" />
                      {userData?.email}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-linear-to-r from-teal-600 via-amber-500 to-amber-400 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-6"
                  >
                    <Edit2 className="w-5 h-5" />
                    تعديل البيانات
                  </button>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">الاسم</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/20 border border-white/30 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="أدخل اسمك"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white/20 border border-white/30 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="أدخل بريدك الإلكتروني"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-linear-to-r from-teal-600 via-amber-500 to-amber-400 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      حفظ التغييرات
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold hover:bg-white/20 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* تاب كلمة المرور */}
          {activeTab === "password" && (
            <div className="bg-white/10 border border-white/20 backdrop-blur-md p-8 rounded-3xl shadow-lg">
              {!isChangingPassword ? (
                <div>
                  <p className="text-gray-300 mb-6">يمكنك تغيير كلمة المرور الخاصة بك من هنا</p>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className="w-full bg-linear-to-r from-teal-600 via-amber-500 to-amber-400 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-5 h-5" />
                    تغيير كلمة المرور
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">كلمة المرور الحالية</label>
                    <input
                      type="password"
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                      className="w-full bg-white/20 border border-white/30 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="أدخل كلمة المرور الحالية"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">كلمة المرور الجديدة</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full bg-white/20 border border-white/30 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="أدخل كلمة مرور جديدة"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full bg-white/20 border border-white/30 p-3 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                      placeholder="أكد كلمة المرور الجديدة"
                      required
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="flex-1 bg-linear-to-r from-teal-600 via-amber-500 to-amber-400 py-3 rounded-2xl font-semibold hover:opacity-90 transition-all"
                    >
                      تحديث كلمة المرور
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsChangingPassword(false)}
                      className="flex-1 bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold hover:bg-white/20 transition-all"
                    >
                      إلغاء
                    </button>
                  </div>

                  <div className="border-t border-white/20 pt-6">
                    <p className="text-gray-300 text-sm mb-4">نسيت كلمة المرور؟</p>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={isSendingReset}
                      className={`w-full bg-white/10 border border-white/20 py-3 rounded-2xl font-semibold transition-all ${
                        isSendingReset ? "opacity-50 cursor-not-allowed" : "hover:bg-white/20"
                      }`}
                    >
                      {isSendingReset ? "جاري الإرسال..." : "إرسال رابط تغيير كلمة المرور"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* تاب الطلبات */}
          {activeTab === "orders" && (
            <div>
              {userOrders.length === 0 ? (
                <div className="bg-white/10 border border-white/20 backdrop-blur-md p-12 rounded-3xl text-center">
                  <p className="text-xl text-gray-300 mb-6">لم تقم بأي طلبات بعد 📦</p>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-linear-to-r from-amber-500 to-yellow-500 px-8 py-3 rounded-2xl text-black font-semibold hover:opacity-90 transition-all"
                  >
                    ابدأ التسوق الآن
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div
                      key={order._id}
                      className="bg-white/10 border  border-white/20 backdrop-blur-md p-6 rounded-3xl hover:shadow-amber-400/30 transition-all"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-300 text-sm">رقم الطلب</p>
                          <p className="font-semibold text-amber-400">{order._id.slice(-8)}</p>
                        </div>

                        <div>
                          <p className="text-gray-300 text-sm">التاريخ</p>
                          <p className="font-semibold">{moment(order.createdAt).fromNow()}</p>
                        </div>

                        <div>
                          <p className="text-gray-300 text-sm">المجموع</p>
                          <p className="font-semibold text-amber-400">${order.amount?.toFixed(2) || "0"}</p>
                        </div>

                        <div>
                          <p className="text-gray-300 text-sm">الحالة</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              order.status === "Delivered"
                                ? "bg-green-500/30 text-green-200"
                                : order.status === "Pending".toUpperCase()
                                  ? "bg-blue-500/30 text-blue-200"
                                  : "bg-yellow-500/30 text-yellow-200"
                            }`}
                          >
                            {order.status === "Delivered".toUpperCase() && "تم التسليم ✅"}
                            {order.status === "on the way".toUpperCase() && "تم التسليم ✅"}
                            {order.status === "canceled".toUpperCase() && "تم الغاء الطلب"}
                            {order.status === "Pending".toUpperCase() && "في الانتظار 🕐"}
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

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-8 py-3 rounded-2xl font-semibold transition-all"
          >
            <LogOut className="w-5 h-5" />
            تسجيل الخروج
          </button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
