import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { CheckCircle2, XCircle, Loader2, RefreshCw, Home, ShoppingBag } from "lucide-react";
import axiosInstance from "../axios/axiosInstance";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  const { clearCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const isVerifying = useRef(false);

  const verifyPayment = useCallback(async () => {
    if (!orderId) {
      setStatus("error");
      setErrorMessage("معرف الطلب غير متوفر أو الرابط غير صالح.");
      return;
    }

    if (success !== "true") {
      setStatus("error");
      setErrorMessage("تم إلغاء عملية الدفع أو لم تكتمل بنجاح.");
      return;
    }

    if (isVerifying.current) return;
    isVerifying.current = true;
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await axiosInstance.post("/api/order/verify", {
        success,
        orderId,
        sessionId,
      });

      if (res.data?.success) {
        try {
          await clearCart();
        } catch (e) {
          console.warn("Failed to clear cart:", e);
        }
        setStatus("success");
        setTimeout(() => navigate("/myorder"), 3000);
      } else {
        setStatus("error");
        setErrorMessage(res.data?.message || "تعذر التحقق من عملية الدفع من قبل الخادم.");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("error");
      setErrorMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "حدث خطأ أثناء الاتصال بالخادم للتحقق من عملية الدفع."
      );
    } finally {
      isVerifying.current = false;
    }
  }, [orderId, sessionId, success, clearCart, navigate]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4 py-16">
      <div className="w-full max-w-md bg-slate-900/70 border border-slate-800/90 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-2xl">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-16 h-16 animate-spin text-amber-400" />
            <h2 className="text-2xl font-bold text-white">جاري التحقق من عملية الدفع...</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              يرجى الانتظار ثوانٍ معدودة، جاري تأكيد الطلب مع بوابة الدفع.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">تم الدفع بنجاح!</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              تم تأكيد طلبك بنجاح، جاري نقلك لسجل الطلبات...
            </p>
            <div className="pt-2">
              <Link
                to="/myorder"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20"
              >
                <ShoppingBag className="w-4 h-4" />
                عرض طلباتي الآن
              </Link>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center shadow-lg shadow-red-500/10">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">تعذر تأكيد عملية الدفع</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {errorMessage || "حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى."}
            </p>
            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={verifyPayment}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all border border-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة
              </button>
              <Link
                to="/"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-all"
              >
                <Home className="w-4 h-4" />
                الرئيسية
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Verify;
