import { useState, useEffect, useContext } from "react";
import { ShoppingBag } from "lucide-react";
import { ShopContext } from "../context/ShopContext";

const Offer = () => {
  const { addToCart, all_products } = useContext(ShopContext);

  const [timeLeft, setTimeLeft] = useState({});
  const [products] = useState(all_products?.slice(0, 12)); // أول 12 منتج كمثال

  // عداد تنازلي لمعرض التخفيضات
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 5); // عرض 5 أيام على سبيل المثال

    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate - now;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-24 px-6 sm:px-10">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">متجرنا العصري</h2>
        <p className="text-gray-300 mb-12 text-lg sm:text-xl">اكتشف أحدث المنتجات واغتنم التخفيضات قبل انتهاء الوقت!</p>

        <div className="flex justify-center items-center md:gap-6 gap-2 mb-16 text-center">
          {["days", "hours", "minutes", "seconds"].map((unit) => (
            <div key={unit} className="bg-white/10 backdrop-blur-md rounded-3xl p-2 md:p-6 w-24 sm:w-28 shadow-lg">
              <span className="block md:text-3xl text-2xl md:font-bold font-light text-amber-400">
                {timeLeft[unit] ?? 0}
              </span>
              <span className="block mt-2 text-gray-200 capitalize ">{unit}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products?.map((p) => (
            <div
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl overflow-hidden shadow-2xl
              hover:scale-105 hover:shadow-amber-400/30 transition-all duration-500"
              key={p._id}
            >
              <div className="w-full relative h-64 flex items-center justify-center bg-linear-to-b from-teal-800/40 to-transparent">
                <img
                  src={p.image}
                  className="object-contain w-56 h-56 hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-5 text-left">
                <h3 className="text-lg font-semibold mb-2 truncate">{p.name}</h3>
                <p className="mb-4 text-gray-300 text-sm line-clamp-2">{p.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-amber-400">${p.price.toFixed(2)}</span>
                  <button
                    onClick={() => addToCart(p._id)}
                    className="flex items-center gap-2 bg-linear-to-r from-teal-600 px-4 py-2 cursor-pointer
                   via-amber-500 to-amber-400 rounded-xl font-semibold hover:opacity-90 transition-all text-white shadow-lg"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Offer;
