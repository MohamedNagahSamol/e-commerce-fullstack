import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Cookies from "js-cookie";
import axiosInstance from "../axios/axiosInstance";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const sessionId = searchParams.get("session_id");

  const { clearCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const hasVerified = useRef(false);

  useEffect(() => {
    if (hasVerified.current) return;
    if (!Cookies.get("accessToken")) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const verifyPayment = async () => {
      try {
        hasVerified.current = true;

        const res = await axiosInstance.post(
          "/api/order/verify",
          { success, orderId, sessionId },
          { signal }
        );

        if (res.data.success) {
          await clearCart();
          setStatus("success");
          setTimeout(() => navigate("/myorder"), 2500);
        } else {
          setStatus("error");
          setTimeout(() => navigate("/"), 2500);
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.log(err);
          setStatus("error");
          setTimeout(() => navigate("/"), 2500);
        }
      }
    };

    verifyPayment();
    return () => controller.abort();
  }, [success, orderId, sessionId, navigate, clearCart]);

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-md">
        {status === "loading" && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-16 h-16 animate-spin text-amber-400" />
            <h2 className="text-2xl font-bold text-white">جاري التحقق من عملية الدفع...</h2>
            <p className="text-slate-400 text-sm">يرجى الانتظار ثوانٍ معدودة ولا تقم بإغلاق الصفحة.</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">تم الدفع بنجاح!</h2>
            <p className="text-slate-400 text-sm">تم تأكيد طلبك وإرسال الإشعار، جاري نقلك لسجل الطلبات...</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
              <XCircle className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">تعذر تأكيد عملية الدفع</h2>
            <p className="text-slate-400 text-sm">حدث خطأ أو تم إلغاء العملية، جاري إعادتك للصفحة الرئيسية...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Verify;
