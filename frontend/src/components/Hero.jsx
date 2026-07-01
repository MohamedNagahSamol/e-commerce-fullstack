import { ShoppingCart } from "lucide-react";
import heroImage from "../assets/bg.png";
function Hero() {
  return (
    <section
      className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white 
    flex items-center"
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="z-10 relative max-w-7xl mx-auto px-6 sm:px-10 flex flex-col-reverse md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight">
            اكتشف أحدث المنتجات <br /> مع أفضل التخفيضات!
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-xl">
            تسوق الان و اتستمتع بعروض لا تفوت علي الاكترونيات و الازياء . و
            المنتجات المميزه و ز احصل علي خصومات تصل الي %50 لفتره محدوده
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 mt-6">
            <button
              onClick={() => (window.location.href = "/shop")}
              className="flex items-center gap-3 bg-amber-400 hover:bg-amber-500 text-white font-bold px-8 py-4 rounded-2xl 
              text-xl shadow-2xl transition-transform transform hover:scale-105 cursor-pointer"
            >
              تصفح الان<ShoppingCart/>
            </button>
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-lg">
          <img
            src={heroImage}
            className="w-full h-full object-cover rounded-3xl shadow-2xl"
          />
          <div className="font-bold absolute top-6 left-6 bg-red-500 text-white px-5 py-3 rounded-full shadow-lg animate-pulse text-lg">
            خصم حتي %50
          </div>
        </div>
      </div>
      <div className="w-full absolute bottom-0 overflow-hidden leading-none rotate-180">
        <svg
          viewBox="0 0 850 85"
          preserveAspectRatio="none"
          className="w-full h-28"
        >
          <path
            d="M0,0V46.29c47.19,22,103.23,29,158.5,17.33C251,48.21,317.2,8.22,384,1.13c60.86-6.46,118.91,12.08,176,31.49,59.45,20.15,118.85,39.69,179,25.36,62.47-14.92,123-50.71,185-65.92C997,16,1061,23,1120,38.09c61.63,15.83,119.72,37.38,180,51.4V0Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
}

export default Hero;
