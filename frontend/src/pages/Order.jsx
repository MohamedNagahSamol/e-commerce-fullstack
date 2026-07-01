import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios/axiosInstance";
import Cookies from "js-cookie";
const Order = () => {
  const { cartItem, all_products, getTotalCartAmount } = useContext(ShopContext);
  const navigate = useNavigate();
  const total = getTotalCartAmount();

  const cartProducts = Object.keys(cartItem)
    .map((id) => {
      const product = all_products.find((p) => p._id === id);
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

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!shipping.name || !shipping.address || !shipping.city || !shipping.phone) {
      alert("⚠️ يرجى ملء جميع بيانات الشحن");
      return;
    }
    if (submitting) return;
    setSubmitting(true);

    let orderItem = [];
    all_products.map((product) => {
      if (cartItem[product._id] > 0) {
        let iteminfo = product;
        iteminfo["quantity"] = cartItem[product._id];
        orderItem.push(iteminfo);
      }
    });
    const orderData = {
      items: orderItem,
      amount: total,
      address: shipping,
    };

    try {
      let res = await axiosInstance.post("/api/order/place", orderData);
      if (res.data.success) {
        window.location.replace(res.data.session);
      } else if (!res.data.success) {
        window.location.replace(res.data.session);
        alert(res.data.message || res.data.error);
      }
    } catch (err) {
      console.log(err);
      alert("حدث خطأ أثناء تقديم الطلب");
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    if (!Cookies.get("accessToken")) {
      navigate("/login");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [navigate, getTotalCartAmount]);
  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-24 px-6 sm:px-10">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-12 text-center">إتمام الطلب</h2>

        {cartProducts.length === 0 ? (
          <div className="text-center text-gray-300 mt-20 space-y-6">
            <p className="text-xl">🛒 السلة فارغة الآن</p>
            <button
              onClick={() => navigate("/")}
              className="bg-linear-to-r from-amber-500 to-yellow-500 px-8 py-3 rounded-2xl font-semibold text-white hover:opacity-90 transition-all"
            >
              العودة للتسوق
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              {cartProducts.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl shadow-lg border border-white/20"
                >
                  <img src={item.image} className="w-20 h-20 object-contain rounded-xl" alt={item.name} />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-300">الكمية: {item.quantity}</p>
                    <p className="text-amber-400 font-bold">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}

              <div className="text-xl font-bold mt-6">
                المجموع الكلي:
                <span className="text-amber-400 ml-2">${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl">
              <h3 className="text-2xl font-semibold mb-6 text-center">بيانات الشحن</h3>

              <div className="space-y-4">
                <form onSubmit={placeOrder}>
                  <input
                    type="text"
                    name="name"
                    placeholder="الاسم"
                    value={shipping.name}
                    onChange={handleChange}
                    className="w-full bg-white/15 mb-3 text-white placeholder-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="العنوان"
                    value={shipping.address}
                    onChange={handleChange}
                    className="w-full bg-white/15 mb-3 text-white placeholder-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="المدينه"
                    value={shipping.city}
                    onChange={handleChange}
                    className="w-full bg-white/15 mb-3 text-white placeholder-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="رقم الهاتف"
                    value={shipping.phone}
                    onChange={handleChange}
                    className="w-full bg-white/15 mb-3 text-white placeholder-gray-300 px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="block bg-linear-to-r from-teal-600 via-amber-600 to-amber-800 w-full rounded bg-primary px-6 pb-2 pt-2.5 text-xs hover:opacity-80 font-medium uppercase leading-normal text-white shadow-lg hover:shadow-amber-400/30 transition cursor-pointer duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    {submitting ? "جاري تقديم الطلب..." : "اتمام الطلب"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Order;
