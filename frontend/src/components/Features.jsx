import { Truck, RefreshCcw, ShieldCheck, Headphones } from "lucide-react";

const featuresData = [
  {
    Icon: Truck,
    title: "شحن سريع ومجاني",
    desc: "توصيل مجاني للطلبات الأكثر من $100 مع متابعة حية لمسار الشحنة.",
    badge: "سرعة وأمان",
    iconColor: "text-amber-400",
    bgGradient: "from-amber-500/10 to-yellow-500/5",
    borderHover: "hover:border-amber-400/40",
  },
  {
    Icon: ShieldCheck,
    title: "ضمان أصلي 100%",
    desc: "جميع المنتجات معتمدة ومطابقة للمواصفات العالمية وموثقة برقم تسلسلي.",
    badge: "جودة موثوقة",
    iconColor: "text-emerald-400",
    bgGradient: "from-emerald-500/10 to-teal-500/5",
    borderHover: "hover:border-emerald-400/40",
  },
  {
    Icon: RefreshCcw,
    title: "استبدال واسترجاع مرن",
    desc: "إمكانية الاسترجاع أو الاستبدال بكل سهولة وسرعة خلال 14 يوماً من الاستلام.",
    badge: "راحة بال",
    iconColor: "text-blue-400",
    bgGradient: "from-blue-500/10 to-cyan-500/5",
    borderHover: "hover:border-blue-400/40",
  },
  {
    Icon: Headphones,
    title: "دعم فني على مدار الساعة",
    desc: "فريق دعم متخصص للإجابة على استفساراتكم ومتابعة طلباتكم 24/7.",
    badge: "خدمة متميزة",
    iconColor: "text-purple-400",
    bgGradient: "from-purple-500/10 to-pink-500/5",
    borderHover: "hover:border-purple-400/40",
  },
];

function Features() {
  return (
    <section className="w-full relative bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 text-white border-y border-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-widest bg-amber-400/10 px-3.5 py-1.5 rounded-full border border-amber-400/20">
            ميزتنا التنافسية
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            لماذا يفضل العملاء التسوق معنا؟
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            نلتزم بتقديم تجربة تسوق استثنائية تبدأ من اختيار المنتج وحتى وصوله إلى باب منزلك.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((item, index) => (
            <div
              key={index}
              className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl p-7 flex flex-col justify-between text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60 ${item.borderHover} group relative overflow-hidden`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.bgGradient} border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <item.Icon className={`w-7 h-7 ${item.iconColor}`} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/60 px-2.5 py-1 rounded-lg">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
