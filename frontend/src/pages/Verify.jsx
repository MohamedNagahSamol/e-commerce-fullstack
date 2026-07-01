import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
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
  
  // ✅ useRef لمنع multiple calls
  const hasVerified = useRef(false);

  useEffect(() => {
    // ✅ التحقق من أن الـ verification لم يتم بعد
    if (hasVerified.current) return;
    if (!Cookies.get("accessToken")) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const verifyPayment = async () => {
      try {
        // ✅ وضع علامة أن verification بدأ
        hasVerified.current = true;

        const res = await axiosInstance.post(
          "/api/order/verify",
          { success, orderId, sessionId },
          { signal }
        );

        if (res.data.success) {
          await clearCart();
          setStatus("success");
          setTimeout(() => navigate("/myorder"), 2000);
        } else {
          setStatus("error");
          setTimeout(() => navigate("/"), 2000);
        }
      } catch (err) {
        // ✅ في حالة الخطأ، إعادة تعيين لإمكانية retry
        if (err.name !== "CanceledError") {
          console.log(err);
          setStatus("error");
          setTimeout(() => navigate("/"), 2000);
        }
      }
    };

    verifyPayment();

    return () => controller.abort();
  }, [success, orderId, sessionId, navigate]); // ✅ إزالة clearCart من dependencies

  return (
    <section className="min-h-screen flex items-center justify-center bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white px-6">
      <div className="text-center flex flex-col items-center">
        {status === "loading" && (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-20 h-20 animate-spin text-amber-400 mb-6" />
            <h2 className="text-2xl font-semibold">جاري التحقق من عمليه الدفع ...</h2>
            <p className="mt-2 text-gray-300">يرجي الانتظار قليلا</p>
          </div>
        )}
        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-20 h-20 animate-spin text-amber-400 mb-6" />
            <h2 className="text-2xl font-semibold">تم الدفع بنجاح</h2>
            <p className="mt-2 text-gray-300">سيتم نقلك الي طلباتك الان ...</p>
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle className="w-20 h-20 animate-spin text-amber-400 mb-6" />
            <h2 className="text-2xl font-semibold">فشلت عمليه الدفع</h2>
            <p className="mt-2 text-gray-300">سيتم اعادتك الي الصفحه الرئسيه حدث خطاء اثناء التحقق</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Verify;
