import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import { Loader2, Lock, KeyRound, CheckCircle2 } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!searchParams.get("token")) {
      const timer = setTimeout(() => navigate("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, navigate]);

  const activeError = error || (!token ? "رابط غير صالح. يرجى استخدام الرابط الموجود في البريد الإلكتروني." : "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف كبير ورقم ورمز");
      return;
    }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/user/reset-password", {
        token: token,
        newPassword: formData.newPassword,
      });

      if (res.data?.success) {
        setSuccess("تم تغيير كلمة المرور بنجاح! جاري تحويلك لصفحة تسجيل الدخول...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        const rawMsg = res.data?.message;
        setError(Array.isArray(rawMsg) ? rawMsg[0]?.msg : rawMsg || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
      }
    } catch (err) {
      const rawMsg = err.response?.data?.message;
      const message = Array.isArray(rawMsg)
        ? rawMsg[0]?.msg
        : typeof rawMsg === "string"
          ? rawMsg
          : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
      if (typeof message === "string" && (message.includes("expired") || message.includes("time url expired"))) {
        setError("انتهت صلاحية الرابط. يرجى طلب رابط جديد.");
      } else if (typeof message === "string" && message.includes("not found")) {
        setError("الرابط غير صالح أو تم استخدامه من قبل.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-slate-950 text-white py-24 px-4 sm:px-6 flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/70 border border-slate-800/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl text-right">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/25">
          <KeyRound className="w-7 h-7 text-slate-950" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-center text-white mb-2">
          إعادة تعيين كلمة المرور
        </h1>
        <p className="text-center text-slate-400 text-xs sm:text-sm mb-8">
          أدخل كلمة المرور الجديدة الخاصة بحسابك لحمايته.
        </p>

        {activeError && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-xl mb-6 text-center">
            ⚠️ {activeError}
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold p-3.5 rounded-xl mb-6 text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{success}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                type="password"
                name="newPassword"
                placeholder="••••••••"
                value={formData.newPassword}
                onChange={handleChange}
                disabled={loading || !token}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">تأكيد كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading || !token}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحديث...</span>
              </>
            ) : (
              <span>تحديث كلمة المرور</span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          تذكرت كلمة المرور؟{" "}
          <Link to="/login" className="text-amber-400 font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </section>
  );
};

export default ResetPassword;
