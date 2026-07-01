import { useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const Cart = () => {
  const { cartItem, all_products, addToCart, removeFromCart, getTotalCartAmount } = useContext(ShopContext);

  const navigate = useNavigate();
  const total = getTotalCartAmount();

  const cartProducts = Object.keys(cartItem).map((id) => {
    const product = all_products.find((p) => p._id === id);
    return { ...product, quantity: cartItem[id] };
  });
  useEffect(() => {
    if (!Cookies.get("accessToken")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-950 text-white py-24 px-6 sm:px-10">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none"></div>
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-semibold mb-12 text-center">سلة التسوق الخاصة بك</h2>

        {cartProducts.length === 0 ? (
          <div  className="text-center text-gray-300 mt-20 space-y-6">
            <p className="text-xl">السلة فارغة الآن 🛒</p>
            <button
              onClick={() => navigate("/")}
              className="bg-linear-to-r from-amber-500 to-yellow-500 px-8 py-3 rounded-2xl text-white hover:opacity-90 transition-all"
            >
              ابدأ التسوق الآن
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6 mb-12">
              {cartProducts.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center justify-between bg-white/10 border border-white/20 
                  backdrop-blur-md rounded-3xl shadow-lg hover:shadow-amber-400/30 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <img src={item.image} className="w-24 h-24 object-contain rounded-xl" />

                    <div>
                      <h3 className="text-xl font-semibold">{item.name}</h3>

                      <p className="text-gray-300 text-sm mt-1 line-clamp-1">{item.description}</p>

                      <p className="text-amber-400 text-lg font-bold mt-2">${item.price?.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-6 sm:mt-10">
                    <button
                      className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <span className="text-lg font-semibold">{item.quantity}</span>
                    <button
                      className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all"
                      onClick={() => addToCart(item._id)}
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all"
                      onClick={() => removeFromCart(item._id, true)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/10 border border-white/20 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-2xl font-bold">
                المجموع الكلي:
                <span className="text-amber-400 ml-3">${total?.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate("/order")}
                className="flex items-center w-36 justify-center gap-3 bg-linear-to-r from-teal-600 via-amber-500 to-amber-400 py-4 rounded-2xl font-semibold hover:opacity-90 transition-all text-white shadow-lg"
              >
                <ShoppingBag /> متابعه الشراء
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
