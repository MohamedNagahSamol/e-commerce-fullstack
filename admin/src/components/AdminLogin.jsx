import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosinstance from "../axios/axiosInstance";
import { ShieldCheck, Mail, Lock, LogIn, Loader2 } from "lucide-react";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (token) {
      navigate("/admin/list");
    }
  }, [navigate]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axiosinstance.post(`/api/admin/login`, {
        email,
        password,
      });
      if (data.success) {
        Cookies.set("adminToken", data.adminToken, {
          path: "/",
          secure: window.location.protocol === "https:",
          sameSite: "lax",
        });
        navigate("/admin/list");
      } else {
        setError(data.message || data.error || "بيانات الدخول غير صحيحة");
      }
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-950 text-white px-4 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <form
        onSubmit={handlesubmit}
        className="relative z-10 bg-slate-900/70 border border-slate-800/90 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md text-right space-y-6"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/25 text-slate-950 font-black">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-white">تسجيل دخول المشرف</h2>
          <p className="text-xs text-slate-400">لوحة التحكم المركزية لإدارة المتجر الإلكتروني</p>
        </div>

        {error && (
          <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-xl text-center">
            ⚠️ {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">البريد الإلكتروني للإدارة</label>
            <div className="relative">
              <input
                type="email"
                placeholder="admin@ecommerce.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
                dir="ltr"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-3.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-sm disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري التحقق...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>دخول لوحة التحكم</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;
