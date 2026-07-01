import { useState, useEffect } from "react";
import axiosInstance from "../axios/axiosInstance";
import { CheckCircle, XCircle, Loader2, Van } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
function MyOrder() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = Cookies.get("accessToken");
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.post(`/api/order/userorders`, { signal });
        if (res.data.success) {
          const orderData = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
          setOrders(orderData);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        setOrders([]);
        setLoading(false);
      }
    };
    if (accessToken) {
      fetchOrders();
      return () => controller.abort();
    } else {
      navigate("/login");
    }
  }, [accessToken, navigate]);
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white px-6">
        <div className="flex flex-col items-center">
          <Loader2 className="w-20 h-20 animate-spin text-amber-400 mb-6" />
          <h2 className="text-2xl font-semibold">Loading your orders...</h2>
          <p className="text-gray-300 mt-2"></p>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 min-h-screen px-6 py-10">
      <h1 className="text-3xl font-bold text-white mt-10 mb-8 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-xl">No Orders yet..</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders.map((order) => {
            const total = order.items?.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0) || 0;
            if (!order.payment) return null;
            return (
              <div
                key={order._id}
                className="bg-linear-to-b from-teal-800/70 to-transparent rounded-2xl shadow-lg p-4 flex flex-col justify-between hover:scale-105 transform transition-all duration-300"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    Order ID : {order._id.slice(-6).toUpperCase()}
                  </h2>
                  <p className="mb-4 text-white">
                    {order.items?.length || 0} Product{order.items && order.items.length > 1 ? "s" : ""}
                  </p>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item._id} className="flex justify-center items-center border-b border-r-gray-200 pb-2">
                        <div className="flex items-center gap-2">
                          {item.image && <img className="w-16 h-16 object-cover" src={item.image} />}{" "}
                          <p className="text-white text-sm">
                            {item.name + " "}X{" " + (item.quantity || 1) + " "}
                          </p>
                          {" = "}
                        </div>{" "}
                        <p className="font-semibold text-white w-30 p-3 ">
                          ${" " + item.price * (item.quantity || 1) + " "}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span
                    className={`flex items-center gap-2 font-semibold ${
                      order.status === "delivered".toUpperCase()
                        ? "text-green-500"
                        : order.status === "pending".toUpperCase()
                          ? "text-yellow-500"
                          : "text-red-500"
                    }`}
                  >
                    {order.status === "delivered".toUpperCase() && <CheckCircle />}
                    {order.status === "on the way".toUpperCase() && <Van />}
                    {order.status === "pending".toUpperCase() && <Loader2 className="animate-spin" />}
                    {order.status === "canceled".toUpperCase() && <XCircle />}
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                  </span>
                  <span className="font-bold text-white">Total:{" " + total}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyOrder;
