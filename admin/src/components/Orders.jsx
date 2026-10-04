import { useState, useEffect } from "react";
import axiosinstance from "../axios/axiosInstance";
import { Loader2, ClipboardCheck, User, MapPin } from "lucide-react";
import toast from "react-hot-toast";

const statusColors = {
  PENDING: "bg-amber-400/10 text-amber-400 border-amber-400/30",
  "ON THE WAY": "bg-blue-400/10 text-blue-400 border-blue-400/30",
  DELIVERED: "bg-emerald-400/10 text-emerald-400 border-emerald-400/30",
  CANCELED: "bg-red-400/10 text-red-400 border-red-400/30",
  CANCELLED: "bg-red-400/10 text-red-400 border-red-400/30",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const fetchOrders = async () => {
      try {
        const res = await axiosinstance.get(`/api/order/list`, { signal: controller.signal });
        if (res.data.success) {
          setOrders(res.data.data || []);
        } else {
          toast.error(res.data.message || "فشل جلب الطلبات");
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(err.message || "حدث خطأ أثناء تحميل الطلبات");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
    return () => controller.abort();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axiosinstance.post(`/api/order/status`, {
        orderId,
        newStatus,
      });

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order))
        );
        toast.success("تم تحديث حالة الطلب بنجاح");
      } else {
        toast.error(res.data.message || "فشل تحديث الحالة");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "حدث خطأ في التحديث");
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white md:pl-64 pt-20 md:pt-10 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900 text-right">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">إدارة طلبات العملاء</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              متابعة وتحديث حالات الشحن وتأكيد الدفع لطلبات المتجر ({orders.length} طلب).
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            <p className="text-sm text-slate-400 font-bold">جاري تحميل الطلبات...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md mx-auto space-y-3">
            <ClipboardCheck className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">لا توجد طلبات جديدة حتى الآن</h3>
            <p className="text-xs text-slate-400">ستظهر هنا جميع الطلبات التي يقوم العملاء بتأكيدها في المتجر.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => {
              const total = order.items?.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1), 0) || 0;
              const badgeClass = statusColors[order.status] || "bg-slate-800 text-slate-300 border-slate-700";

              return (
                <div
                  key={order._id}
                  className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xl text-right space-y-4 hover:border-slate-700 transition-all"
                >
                  <div className="space-y-4">
                    {/* Top bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeClass}`}>
                        {order.status}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-400">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-2 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-850">
                      <div className="flex items-center justify-end gap-2 text-slate-200">
                        <span className="font-bold">{order.name || order.address?.name || "بدون اسم"}</span>
                        <User className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <div className="flex items-center justify-end gap-2 text-slate-300">
                        <span dir="ltr">{order.address?.phone || "غير متوفر"}</span>
                        <span className="text-slate-500">:الهاتف</span>
                      </div>
                      <div className="flex items-start justify-end gap-2 text-slate-400">
                        <span className="text-right">
                          {order.address
                            ? `${order.address.city || ""}, ${order.address.address || ""}`
                            : "العنوان غير متوفر"}
                        </span>
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                      </div>
                      <div className="pt-2 border-t border-slate-850 flex items-center justify-between text-[11px]">
                        <span className={`font-bold ${order.payment ? "text-emerald-400" : "text-amber-400"}`}>
                          {order.payment ? "✓ تم الدفع إلكترونياً" : "⏳ بانتظار الدفع"}
                        </span>
                        <span className="text-slate-400">حالة الدفع:</span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                      <p className="text-[11px] font-bold text-slate-400">عناصر الطلب ({order.items?.length || 0}):</p>
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-slate-950/40 p-2 rounded-lg border border-slate-850 text-xs"
                        >
                          <span className="font-mono font-bold text-amber-400">
                            ${((Number(item.price) || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-200 font-medium">
                              {item.name} × {item.quantity || 1}
                            </span>
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-7 h-7 object-contain bg-slate-900 rounded p-0.5" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="PENDING">Pending (قيد الانتظار)</option>
                      <option value="ON THE WAY">On the way (جاري الشحن)</option>
                      <option value="DELIVERED">Delivered (تم التوصيل)</option>
                      <option value="CANCELED">Canceled (ملغي)</option>
                    </select>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">الإجمالي</span>
                      <span className="text-base font-black text-amber-400 font-mono">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Orders;
