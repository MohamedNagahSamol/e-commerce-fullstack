import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";

const Cart = () => {
  const { cartItem, all_products, addToCart, removeFromCart, getTotalCartAmount } = useContext(ShopContext);
  const navigate = useNavigate();
  const total = getTotalCartAmount() || 0;

  const cartProducts = Object.keys(cartItem || {})
    .filter((id) => (cartItem[id] || 0) > 0)
    .map((id) => {
      const product = (all_products || []).find((p) => p._id === id);
      return product ? { ...product, quantity: cartItem[id] } : null;
    })
    .filter(Boolean);

  useEffect(() => {
    if (!Cookies.get("accessToken")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <section className="relative w-full min-h-screen bg-slate-950 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-900 text-right">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">سلة المشتريات</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              راجع عناصر السلة وحدد الكميات قبل الانتقال لإتمام الدفع.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>متابعة التسوق وإضافة منتجات أخرى</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {cartProducts.length === 0 ? (
          /* Empty State */
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 sm:p-16 text-center max-w-xl mx-auto space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">سلة التسوق فارغة حالياً</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                لم تقم بإضافة أي منتجات إلى السلة بعد. استكشف كتالوج المنتجات المميزة وابدأ التسوق الآن!
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all cursor-pointer"
            >
              تصفح المنتجات الآن
            </button>
          </div>
        ) : (
          /* Cart Content: Two columns */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
            {/* Products List */}
            <div className="lg:col-span-8 space-y-4">
              {cartProducts.map((item) => {
                const itemTotal = (Number(item.price) || 0) * item.quantity;
                return (
                  <div
                    key={item._id}
                    className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-slate-700/80 transition-all backdrop-blur-md"
                  >
                    {/* Thumbnail & Title */}
                    <div className="flex items-center gap-4 w-full sm:w-auto text-right">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-950/80 border border-slate-800 p-2 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">
                          {item.name}
                        </h3>
                        {item.category && (
                          <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md inline-block">
                            {item.category}
                          </span>
                        )}
                        <p className="text-amber-400 font-bold text-sm">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity controls & Subtotal */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-800/80">
                      <div className="inline-flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                        <button
                          onClick={() => removeFromCart(item._id)}
                          aria-label="إنقاص الكمية"
                          className="w-8 h-8 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-10 text-center font-bold text-sm font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item._id)}
                          aria-label="زيادة الكمية"
                          className="w-8 h-8 rounded-lg bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="text-[11px] text-slate-500 block font-normal">الإجمالي</span>
                        <span className="text-base font-black text-white font-mono">
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id, true)}
                        title="حذف المنتج من السلة"
                        className="p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sticky Card */}
            <div className="lg:col-span-4 bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 lg:sticky lg:top-28 shadow-xl backdrop-blur-md text-right">
              <h2 className="text-xl font-bold text-white pb-4 border-b border-slate-800/80">
                ملخص الطلب
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-mono">${total.toFixed(2)}</span>
                  <span>المجموع الفرعي:</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="text-emerald-400 font-semibold">
                    {total >= 100 ? "مجاني" : "$15.00"}
                  </span>
                  <span>تكلفة الشحن والتوصيل:</span>
                </div>
                {total < 100 && (
                  <p className="text-[11px] text-amber-400/90 bg-amber-400/10 p-2.5 rounded-xl border border-amber-400/20">
                    💡 اضف منتجات بقيمة ${(100 - total).toFixed(2)} إضافية للحصول على شحن مجاني!
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
                <span className="text-2xl font-black text-amber-400 font-mono">
                  ${(total >= 100 ? total : total + (total > 0 ? 15 : 0)).toFixed(2)}
                </span>
                <span className="text-lg font-bold text-white">المجموع النهائي:</span>
              </div>

              <button
                onClick={() => navigate("/order")}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-base"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>متابعة إتمام الطلب</span>
              </button>

              <div className="pt-4 border-t border-slate-800/60 space-y-2">
                <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
                  <span>دفع إلكتروني آمن ومحمي 100%</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center justify-end gap-2 text-xs text-slate-400">
                  <span>توصيل سريع لباب المنزل</span>
                  <Truck className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
