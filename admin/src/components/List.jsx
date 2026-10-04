import { useState, useEffect } from "react";
import axiosinstance from "../axios/axiosInstance";
import toast from "react-hot-toast";
import { Trash2, Plus, Search, Package, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

function List() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const fetchProduction = async () => {
      try {
        const res = await axiosinstance.get(`/api/product/list`, { signal: controller.signal });
        if (res.data.success) {
          setProducts(res.data.data || []);
        } else {
          toast.error(res.data.message || "فشل جلب المنتجات");
        }
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error(err.message || "حدث خطأ أثناء تحميل المنتجات");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduction();
    return () => controller.abort();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المنتج نهائياً من المتجر؟")) return;
    try {
      const res = await axiosinstance.post(`/api/product/remove`, { id });
      if (res.data?.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        toast.success("تم حذف المنتج بنجاح");
      } else {
        toast.error(res.data?.message || "فشل حذف المنتج");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء الحذف");
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="min-h-screen bg-slate-950 text-white md:pl-64 pt-20 md:pt-10 pb-16 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-900 text-right">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">قائمة المنتجات</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              إدارة وتعديل وحذف المنتجات المعروضة في المتجر الإلكتروني ({products.length} منتج).
            </p>
          </div>

          <Link
            to="/admin/add"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 text-xs sm:text-sm hover:scale-105 transition-all self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة منتج جديد</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="ابحث باسم المنتج أو الفئة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-amber-400 text-right"
          />
          <Search className="w-4 h-4 text-slate-500 absolute top-3.5 right-3.5" />
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-amber-400" />
            <p className="text-sm text-slate-400 font-bold">جاري تحميل المنتجات...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md mx-auto space-y-3">
            <Package className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">لا توجد منتجات مطابقة للبحث</h3>
            <p className="text-xs text-slate-400">جرب البحث بكلمات أخرى أو أضف منتجات جديدة للمتجر.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between text-right"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-slate-950 p-4 flex items-center justify-center relative border-b border-slate-800/60">
                  {product.category && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-lg bg-slate-900/90 text-amber-300 text-[10px] font-bold border border-slate-800">
                      {product.category}
                    </span>
                  )}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-base font-black text-amber-400 font-mono">
                      ${Number(product.price).toFixed(2)}
                    </span>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default List;
