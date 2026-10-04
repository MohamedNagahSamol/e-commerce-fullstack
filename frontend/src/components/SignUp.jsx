import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Cookies from "js-cookie";
import axiosInstance from "../axios/axiosInstance";
import { User, Mail, Lock, UserPlus, ShoppingBag, Loader2 } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAccessToken } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (Cookies.get("accessToken")) navigate("/");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleConfirmSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.password.length < 8) {
      setError("يجب أن تتكون كلمة المرور من 8 أحرف على الأقل");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    const newUrl = `/api/user/register`;
    const Data = { email: formData.email, password: formData.password, name: formData.name };

    try {
      const res = await axiosInstance.post(newUrl, Data);
      if (res.data?.success) {
        Cookies.set("accessToken", res.data.token, { path: "/", secure: true, sameSite: "lax" });
        setAccessToken(res.data.token);
        navigate("/");
      } else {
        const message = res.data?.message;
        setError(
          Array.isArray(message)
            ? message[0]?.msg
            : typeof message === "string" ? message : "مدخل غير صحيح. يرجى المحاولة مرة أخرى.",
        );
      }
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)
          ? message[0]?.msg
          : typeof message === "string" ? message : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-slate-950 text-white py-24 px-4 sm:px-6 flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/70 border border-slate-800/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl text-right">
        {/* Brand Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/25">
          <ShoppingBag className="w-7 h-7 text-slate-950" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-center text-white mb-2">
          إنشاء حساب جديد
        </h1>
        <p className="text-center text-slate-400 text-xs sm:text-sm mb-8">
          انضم إلى مجتمع متجرنا واستمتع بتجربة تسوق فريدة وعروض حصرية!
        </p>

        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-xl mb-6 text-center">
            ⚠️ {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleConfirmSignup}>
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم بالكامل</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                placeholder="محمد علي"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
              />
              <User className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
                dir="ltr"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة المرور (8 أحرف على الأقل)</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">تأكيد كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-sm disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري إنشاء الحساب...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>إنشاء الحساب الآن</span>
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-slate-400">
          لديك حساب بالفعل؟{" "}
          <Link to="/login" className="text-amber-400 font-bold hover:underline">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </section>
  );
};

export default SignUp;
