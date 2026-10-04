import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import Cookies from "js-cookie";
import { ShoppingBag, CreditCard, ShieldCheck, MapPin, Phone, User, Home, Loader2 } from "lucide-react";

const Order = () => {
  const { cartItem, all_products, getTotalCartAmount } = useContext(ShopContext);
  const navigate = useNavigate();
  const total = getTotalCartAmount() || 0;

  const cartProducts = Object.keys(cartItem || {})
    .filter((id) => (cartItem[id] || 0) > 0)
    .map((id) => {
      const product = (all_products || []).find((p) => p._id === id);
      return product ? { ...product, quantity: cartItem[id] } : null;
    })
    .filter(Boolean);

  const [shipping, setShipping] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!shipping.name || !shipping.address || !shipping.city || !shipping.phone) {
      setErrorMessage("يرجى ملء جميع بيانات الشحن المطلوبة");
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    let orderItem = [];
    (all_products || []).forEach((product) => {
      if ((cartItem[product._id] || 0) > 0) {
        orderItem.push({
          ...product,
          quantity: cartItem[product._id],
        });
      }
    });

    const orderData = {
      items: orderItem,
      amount: total,
      address: shipping,
    };

    try {
      const res = await axiosInstance.post("/api/order/place", orderData);
      if (res.data.success && res.data.session) {
        window.location.replace(res.data.session);
      } else {
        setErrorMessage(res.data.message || res.data.error || "حدث خطأ أثناء الانتقال لبوابة الدفع");
        setSubmitting(false);
      }
    } catch (err) {
      console.log(err);
      setErrorMessage(err.response?.data?.message || "حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقاً");
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!Cookies.get("accessToken")) {
      navigate("/login");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cartshop");
    }
  }, [navigate, getTotalCartAmount]);

  return (
    <section className="relative w-full min-h-screen bg-slate-950 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20">
            خطوة الدفع النهائية
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">إتمام الطلب والشحن</h1>
          <p className="text-slate-400 text-sm">
            أدخل عنوان التوصيل وبياناتك للانتقال إلى بوابة الدفع الآمنة (Stripe).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Shipping Form */}
          <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-xl backdrop-blur-md text-right">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-end gap-2.5">
              <span>عنوان التوصيل وبيانات المستلم</span>
              <MapPin className="w-5 h-5 text-amber-400" />
            </h2>

            {errorMessage && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-xl mb-6 text-center">
                ⚠️ {errorMessage}
              </div>
            )}

            <form onSubmit={placeOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">الاسم بالكامل</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    placeholder="مثال: أحمد محمود"
                    value={shipping.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
                  />
                  <User className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">المدينة / المحافظة</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      placeholder="القاهرة / المنوفية"
                      value={shipping.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
                    />
                    <Home className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">رقم الهاتف المحمول</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="01012345678"
                      value={shipping.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
                      dir="ltr"
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">العنوان التفصيلي (الشارع / العمارة / الشقة)</label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    placeholder="شارع التحرير، عمارة 15، شقة 4"
                    value={shipping.address}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pr-10 pl-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm transition-all"
                  />
                  <MapPin className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-base disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري معالجة الطلب والانتقال للدفع...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>تأكيد الطلب والدفع الآمن عبر Stripe (${total.toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>جميع المدفوعات مشفرة ومؤمنة بواسطة معايير PCI-DSS</span>
              </div>
            </form>
          </div>

          {/* Order Review List */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md text-right">
            <h2 className="text-xl font-bold text-white pb-4 border-b border-slate-800/80 flex items-center justify-end gap-2">
              <span>محتويات طلبك ({cartProducts.length})</span>
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            </h2>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {cartProducts.map((item) => (
                <div
                  key={item._id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="text-right">
                    <span className="text-sm font-bold text-amber-400 font-mono">
                      ${((Number(item.price) || 0) * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-400 block font-normal">
                      ${Number(item.price).toFixed(2)} × {item.quantity}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                      <span className="text-[11px] text-slate-400">{item.category}</span>
                    </div>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain bg-slate-900 rounded-lg p-1 border border-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800/80 space-y-2 text-sm">
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-mono">${total.toFixed(2)}</span>
                <span>المجموع الفرعي:</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-emerald-400 font-semibold">مجاني</span>
                <span>الشحن السريع:</span>
              </div>
              <div className="pt-3 border-t border-slate-800/60 flex justify-between items-center text-lg font-bold">
                <span className="text-amber-400 font-mono text-xl">${total.toFixed(2)}</span>
                <span>المبلغ الإجمالي للدفع:</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Order;
