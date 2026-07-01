import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@mui/material/Button";
import axiosInstance from "../axios/axiosInstance";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const check = () => {
      const tokenFromUrl = searchParams.get("token");
      if (!tokenFromUrl) {
        setError("رابط غير صالح. يرجى استخدام الرابط الموجود في البريد الإلكتروني.");
        const timer = setTimeout(() => navigate("/login"), 3000);
        return () => clearTimeout(timer); // ✅ تجنب memory leak
      } else {
        setToken(tokenFromUrl);
      }
    };
    check();
  }, [searchParams, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // التحقق من الحقول
    if (!formData.newPassword || !formData.confirmPassword) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    // التحقق من تطابق كلمات المرور
    if (formData.newPassword !== formData.confirmPassword) {
      setError("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    // التحقق من طول كلمة المرور
    if (formData.newPassword.length < 6) {
      setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/user/reset-password", {
        token: token,
        newPassword: formData.newPassword,
      });

      if (res.data.success) {
        setSuccess("تم تغيير كلمة المرور بنجاح! جاري تحويلك لصفحة تسجيل الدخول...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(res.data.message || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
      }
    } catch (err) {
      const message = err.response?.data?.message;
      if (message?.includes("expired") || message?.includes("time url expired")) {
        setError("انتهت صلاحية الرابط. يرجى طلب رابط جديد.");
      } else if (message?.includes("not found")) {
        setError("الرابط غير صالح أو تم استخدامه من قبل.");
      } else {
        setError(message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-24 px-6 sm:px-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm p-10 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">إعادة تعيين كلمة المرور</h2>

        <p className="text-center text-gray-300 mb-6">أدخل كلمة المرور الجديدة الخاصة بك</p>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            placeholder="كلمة المرور الجديدة"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={loading || !token}
            required
            className="bg-white/30 p-3 rounded-xl text-black placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="تأكيد كلمة المرور الجديدة"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={loading || !token}
            required
            className="bg-white/30 p-3 rounded-xl text-black placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <Button variant="contained" type="submit" disabled={loading || !token} className="w-full rounded-4xl">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                جاري التحديث...
              </span>
            ) : (
              "تغيير كلمة المرور"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-300">
          تذكرت كلمة المرور؟{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-amber-400 font-semibold cursor-pointer hover:underline"
          >
            تسجيل الدخول
          </span>
        </p>
      </div>

      {error && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-xl shadow-lg max-w-md text-center z-50">
          {error}
        </div>
      )}

      {success && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-4 rounded-xl shadow-lg max-w-md text-center z-50">
          {success}
        </div>
      )}
    </section>
  );
};

export default ResetPassword;
