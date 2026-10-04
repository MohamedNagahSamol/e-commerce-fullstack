import { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import { CheckCircle2, XCircle, Loader2, Truck, Package, Clock } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate, Link } from "react-router-dom";

const statusConfig = {
  PENDING: { label: "قيد المراجعة والتجهيز", color: "text-amber-400 bg-amber-400/10 border-amber-400/30", Icon: Clock },
  "ON THE WAY": { label: "جاري التوصيل للشحن", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", Icon: Truck },
  DELIVERED: { label: "تم التوصيل بنجاح", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", Icon: CheckCircle2 },
  CANCELED: { label: "تم الإلغاء", color: "text-red-400 bg-red-400/10 border-red-400/30", Icon: XCircle },
  CANCELLED: { label: "تم الإلغاء", color: "text-red-400 bg-red-400/10 border-red-400/30", Icon: XCircle },
};

function MyOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const controller = new AbortController();
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.post(`/api/order/userorders`, {}, { signal: controller.signal });
        if (res.data.success) {
          const orderData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
          setOrders(orderData.filter(Boolean));
        }
      } catch (err) {
        console.log(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchOrders();
      return () => controller.abort();
    } else {
      navigate("/login");
    }
  }, [accessToken, navigate]);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-amber-400 mb-4" />
          <h2 className="text-xl font-bold">جاري تحميل طلباتك...</h2>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-950 min-h-screen text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20">
            تاريخ المشتريات
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">سجل طلباتي</h1>
          <p className="text-slate-400 text-sm">
            تابع حالة شحن وتوصيل طلباتك السابقة والحالية مباشرة وبكل سهولة.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center max-w-md mx-auto space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">لا توجد طلبات سابقة حتى الآن</h3>
            <p className="text-slate-400 text-sm">
              لم تقم بتأكيد أي طلب بعد. تصفح أحدث العروض والمنتجات المميزة!
            </p>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all text-sm"
            >
              تسوق الآن
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => {
              const total = order.items?.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0) || 0;
              const statusInfo = statusConfig[order.status] || {
                label: order.status,
                color: "text-slate-300 bg-slate-800 border-slate-700",
                Icon: Package,
              };

              return (
                <div
                  key={order._id}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-md hover:border-slate-700 transition-all text-right space-y-4"
                >
                  <div className="space-y-4">
                    {/* Header info */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${statusInfo.color}`}>
                        <statusInfo.Icon className="w-3.5 h-3.5" />
                        <span>{statusInfo.label}</span>
                      </span>

                      <span className="text-xs font-mono font-bold text-slate-400">
                        #{order._id?.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>

                          <div className="flex items-center gap-2.5">
                            <div className="text-right">
                              <p className="text-xs font-bold text-white line-clamp-1">{item.name}</p>
                              <span className="text-[10px] text-slate-400">{item.quantity || 1} قطعة</span>
                            </div>
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-10 h-10 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-lg font-black text-amber-400 font-mono">
                      ${total.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">المجموع الكلي:</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default MyOrder;
