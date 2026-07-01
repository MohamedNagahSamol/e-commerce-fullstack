import { useState, useEffect } from "react";
import axiosinstance from "../axios/axiosInstance";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loadin, SetLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchOrders = async () => {
      try {
        const res = await axiosinstance.get(`/api/order/list`, { signal });

        if (res.data.success) {
          setOrders(res.data.data);
          SetLoading(false);
          toast.success("Orders fetched successfully");
        } else if (!res.data.success) {
          toast.error(res.data.message || res.data.error);
          SetLoading(false);
        }
      } catch (err) {
        console.log(err);
        toast.error(err.message || "Failed to fetch orders");
        SetLoading(false);
      }
    };
    fetchOrders();
    return () => controller.abort();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axiosinstance.post(`/api/order/status`, {
        orderId,
        newStatus,
      });

      if (res.data.success) {
        setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status: newStatus } : order)));
        toast.success(res.data.message || "Status updated successfully");
      } else if (!res.data.success) {
        toast.error(res.data.message || res.data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Failed to update status");
    }
  };
  if (loadin) {
    return (
      <section
        className="min-h-screen flex items-center justify-center bg-linear-to-r from-teal-900
         via-teal-800 to-amber-900 text-white px-6"
      >
        <div className="flex flex-col items-center">
          <Loader2 className="w-20 h-20 animate-spin text-cyan-400 mb-6" />
          <h2 className="text-2xl font-semibold">تحميل الاوردرات...</h2>
        </div>
      </section>
    );
  }
  return (
    <section className="relative w-full  min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-24 px-6 sm:px-10">
      {orders.length === 0 ? (
        <p className="text-center text-gray-300 text-xl">No orders yet 😢</p>
      ) : (
        <>
          <div className="grid gap-6  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {orders.map((order) => {
              const total = order.items?.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
              return (
                <div
                  key={order._id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:scale-105 transform transition-all w-full duration-300 mx-auto"
                >
                  <div className=" overflow-auto">
                    <h2 className="text-lg font-semibold text-gray-200 mb-2">
                      Order ID : {order._id.slice(-6).toUpperCase()}
                    </h2>
                    <p className="mb-1 text-amber-200">
                      <span className="font-semibold">Customer:</span> {order.name || "No Name"}
                    </p>
                    <p className="mb-2 text-sm text-amber-200">
                      <span className="font-semibold">Addrss:</span>{" "}
                      {order.address
                        ? `${order.address.name}, ${order.address.address}, ${order.address.city}, ${order.address.phone}`
                        : "Not Provided"}
                    </p>
                    <p className="mb-3 text-sm text-amber-200">
                      ({order.items?.length || 0})Product
                      {order.items && order.items.length > 1 ? "s" : ""}
                    </p>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item._id} className="flex justify-between items-center border-b border-white/20 pb-1">
                          <div className="flex items-center justify-between gap-2">
                            {item.image && (<img src={`${item.image}`} className="w-10 h-10 object-cover rounded" />)}
                            <p className="text-gray-200 letter-spacing ml-1 text-sm">
                              {item.name+" "}X{" " + item.quantity || 1}
                            </p>
                            {" = "}
                            <span className="font-bold text-gray-100 text-sm">
                              ${item.price * (item.quantity || 1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                 <div className="text-sm text-cyan-200">
                    payment{" "}:{order.payment?" paid":" no paid"}
                 </div>
                  <div className="mt-2 flex justify-between items-center">
                    
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-gray-800 font-semibold cursor-pointer text-sm"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="ON THE WAY">On the way</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELED">Canceled</option>
                    </select>

                    <span className="font-bold text-gray-100 text-sm">Total : ${total}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default Orders;
