import { useState, useEffect } from "react";
import axiosinstance from "../axios/axiosInstance";
import toast from "react-hot-toast";
function List() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchProduction = async () => {
      try {
      const res = await axiosinstance.get(`/api/product/list`, { signal });
      if (res.data.success) {
        setProducts(res.data.data);
        toast.success("Products fetched successfully");
      } else if (!res.data.success) {
        toast.error(res.data.message || res.data.error || "Failed to fetch products");
        console.log("error");
      }
      } catch (err) {
        console.log(err);
        toast.error(err.message || "Failed to fetch products");
      }
    };
    fetchProduction();
    return () => controller.abort();
    
  }, []);
  const handleDelete = async (id) => {
    const res = await axiosinstance.post(`/api/product/remove`, { id: id });
    if (res.data.success) {
      toast.success("Product deleted successfully");
    } else if (!res.data.success) {
      toast.error(res.data.message || res.data.error || "Failed to delete product");
    }
  };
  return (
    <section
      className="relative w-full  min-h-screen bg-linear-to-r from-teal-900 via-teal-800
     to-amber-900 text-white py-10 px-4 sm:px-5 md:px-10 lg:px-14"
    >
      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">قائمة المنتجات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col justify-between shadow-lg"
            >
              <img src={product.image} className="w-full h-32 object-contain mb-4 rounded-xl" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-2 truncate">{product.description}</p>
              <p className="text-amber-400 font-bold mb-2">${product.price}</p>
              <p className="text-gray-300 mb-4">{product.category}</p>

              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-center cursor-pointer  px-4 py-4 rounded-xl text-white font-semibold hover:bg-red-600"
              >
                حذف المنتج
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default List;
