import { useState, useEffect, useContext } from "react";
import { ShoppingBag, Flame, Star, Eye } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const unitLabels = {
  days: "أيام",
  hours: "ساعات",
  minutes: "دقائق",
  seconds: "ثواني",
};

const Offer = () => {
  const { addToCart, all_products } = useContext(ShopContext);
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 28, seconds: 45 });
  const products = all_products?.slice(0, 8) || [];

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 4);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white border-t border-slate-850">
      <div className="max-w-7xl mx-auto">
        {/* Banner Card with Countdown */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/20 p-8 sm:p-12 mb-16 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-right">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-red-400 animate-bounce" />
                <span>عروض حصرية لفترة محدودة</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                تخفيضات الفلاش الأسبوعية
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                اغتنم الفرصة الآن واحصل على أفضل المنتجات بخصومات استثنائية تصل إلى 50%. العرض ساري حتى نفاد الكمية!
              </p>
            </div>

            {/* Countdown Boxes */}
            <div className="flex items-center gap-3 sm:gap-4">
              {["days", "hours", "minutes", "seconds"].map((unit) => (
                <div
                  key={unit}
                  className="bg-slate-950/90 border border-slate-800 rounded-2xl p-3 sm:p-5 min-w-[70px] sm:min-w-[90px] text-center shadow-xl shadow-black/60 backdrop-blur-md"
                >
                  <span className="block text-2xl sm:text-4xl font-black text-amber-400 tracking-tight font-mono">
                    {String(timeLeft[unit] ?? 0).padStart(2, "0")}
                  </span>
                  <span className="block mt-1 text-[11px] sm:text-xs font-semibold text-slate-400">
                    {unitLabels[unit]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Offer Products */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-400/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Image */}
                <div className="relative aspect-square bg-slate-950/80 p-6 flex items-center justify-center overflow-hidden border-b border-slate-800/60">
                  <span className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-lg bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                    وفر 30%
                  </span>

                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                  />

                  <div
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                  >
                    <span className="flex items-center gap-2 bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 shadow-lg">
                      <Eye className="w-4 h-4 text-amber-400" />
                      عرض المنتج
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4 text-right">
                  <div>
                    <div className="flex items-center justify-end gap-1 mb-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-[11px] text-slate-400 font-semibold">(4.9)</span>
                    </div>

                    <h3
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 line-through block font-normal">
                        ${(Number(p.price) * 1.3).toFixed(2)}
                      </span>
                      <span className="text-lg font-black text-amber-400">
                        ${Number(p.price).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p._id)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-amber-500/15 hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>إضافة</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Offer;
