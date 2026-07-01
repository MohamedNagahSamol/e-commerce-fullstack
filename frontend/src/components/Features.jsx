import { Truck, RefreshCcw, ShieldCheck, Headphones } from "lucide-react";
const featuresData = [
  {
    Icon: Truck,
    title: "شحن مجاني",
    desc: "علي الطلبات فوق 100$ في جميع انحاء العالم",
    color: "from-amber-400 to-yellow-500",
  },
  {
    Icon: ShieldCheck,
    title: "ضمان المنتجات",
    desc: "استبدال او استرجاع مجاني خلال 14 يوم",
    color: "from-amber-400 to-yellow-500",
  },
  {
    Icon: RefreshCcw,
    title: "ارجاع سهل",
    desc: "اجراءات بسيطه و سريعه خلال ثواني",
    color: "from-amber-400 to-yellow-500",
  },
  {
    Icon: Headphones,
    title: "دعم 24/7",
    desc: "فريقنا جاهز في مساعدتك في اي وقت",
    color: "from-amber-400 to-yellow-500",
  },
];

function Features() {
  return (
    <section className="w-full relative bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 py-20 text-white">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="z-10 relative max-w-7xl mx-auto px-6 sm:px-10 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-12">
          لماذا تختارنا؟
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 lg:grid-cols-4">
          {featuresData.map(({ Icon, title, desc, color }, index) => (
            <div
              className={`bg-white/20 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col 
              items-center text-center transition-transform transform hover:scale-105 hover:shadow-amber-600/30`}
              key={index}
            >
              <div
                className={`bg-linear-to-r ${color} w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg mb-6`}
              >
                <Icon className="w-10 h-10 text-white" />
               
              </div>
               <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="text-gray-200 text-base">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
