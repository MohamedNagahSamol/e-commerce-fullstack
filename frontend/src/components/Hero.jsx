import { ShoppingBag, ArrowDown, Sparkles, ShieldCheck, Zap } from "lucide-react";
import heroImage from "../assets/bg.png";

function Hero() {
  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[92vh] md:min-h-screen bg-slate-950 text-white flex items-center pt-24 pb-16 overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-16">
        {/* Left Column: Hero Copy */}
        <div className="flex-1 space-y-6 text-center lg:text-right">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>تشكيلة الموسم الجديد الحصرية 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            اكتشف أحدث المنتجات <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-500 bg-clip-text text-transparent">
              بأفضل جودة وأقوى الخصومات!
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
            تسوق الآن واستمتع بتجربة تسوق فريدة مع عروض حصرية على الإلكترونيات، الأزياء ومستحضرات التجميل. توصيل فوري وضمان شامل على جميع الطلبات.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={scrollToCategories}
              className="flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-base sm:text-lg shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <span>تسوق العروض الآن</span>
              <ShoppingBag className="w-5 h-5" />
            </button>

            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold px-6 py-4 rounded-2xl text-base border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <span>لماذا نحن؟</span>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80 max-w-xl mx-auto lg:mx-0">
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-medium">شحن سريع وآمن</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-300 font-medium">منتجات أصلية 100%</span>
            </div>
            <div className="flex items-center gap-2 justify-center lg:justify-start col-span-2 sm:col-span-1">
              <span className="text-amber-400 font-black text-sm">⭐ 4.9/5</span>
              <span className="text-xs text-slate-300 font-medium">تقييم المشترين</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="flex-1 relative w-full max-w-md lg:max-w-lg">
          <div className="relative mx-auto rounded-3xl p-3 bg-gradient-to-b from-slate-800/60 to-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl shadow-black/80 group">
            {/* Image */}
            <div className="overflow-hidden rounded-2xl relative aspect-[4/3] sm:aspect-square bg-slate-900">
              <img
                src={heroImage}
                alt="عروض التسوق"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>

            {/* Discount Badge */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-rose-500 text-white font-black px-5 py-2.5 rounded-2xl shadow-xl shadow-red-500/30 text-sm animate-bounce">
              خصم حتى 50% 🔥
            </div>

            {/* Floating Info Tag */}
            <div className="absolute -bottom-4 -left-4 bg-slate-950/90 border border-slate-800 backdrop-blur-md p-3.5 rounded-2xl shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white">ضمان استرجاع مجاني</p>
                <p className="text-[10px] text-slate-400">خلال 14 يوماً من الاستلام</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
