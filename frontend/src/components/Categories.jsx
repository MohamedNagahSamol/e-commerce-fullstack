import { useState, useContext } from "react";
import { ShoppingBag, Star, Sparkles, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const categoriesConfig = [
  { id: "All", labelAr: "الكل", labelEn: "All" },
  { id: "Men", labelAr: "رجالي", labelEn: "Men" },
  { id: "Women", labelAr: "حريمي", labelEn: "Women" },
  { id: "Kids", labelAr: "أطفال", labelEn: "Kids" },
  { id: "Electronics", labelAr: "إلكترونيات", labelEn: "Electronics" },
  { id: "Cosmetics", labelAr: "تجميل", labelEn: "Cosmetics" },
];

function Categories() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { addToCart, all_products } = useContext(ShopContext);

  const productsList = all_products || [];
  const filteredProducts =
    selectedCategory === "All"
      ? productsList
      : productsList.filter((p) => p.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section
      id="categories"
      className="relative w-full py-24 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white"
    >
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>كتالوج المنتجات</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            تصفح حسب الفئات المختارة
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            اختر فئتك المفضلة واستكشف تشكيلاتنا الحصرية المصممة بأعلى معايير الجودة والأناقة.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-14">
          {categoriesConfig.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 scale-105"
                    : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800/90 border border-slate-800"
                }`}
              >
                <span>{cat.labelAr}</span>
                <span className="text-xs opacity-70">({cat.labelEn})</span>
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">لا توجد منتجات في هذه الفئة حالياً</h3>
            <p className="text-slate-400 text-sm mb-6">
              نعمل على إضافة منتجات جديدة قريباً، يمكنك استكشاف بقية الفئات الأخرى!
            </p>
            <button
              onClick={() => setSelectedCategory("All")}
              className="px-6 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm hover:bg-amber-300 transition-all cursor-pointer"
            >
              عرض جميع المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="bg-slate-900/70 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-amber-400/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Product Image Area */}
                <div className="relative aspect-square bg-slate-950/80 p-6 flex items-center justify-center overflow-hidden border-b border-slate-800/60">
                  {p.category && (
                    <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-700/60 text-[11px] font-semibold text-amber-300">
                      {p.category}
                    </span>
                  )}

                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                  />

                  {/* Quick view overlay */}
                  <div
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-[2px]"
                  >
                    <span className="flex items-center gap-2 bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 shadow-lg">
                      <Eye className="w-4 h-4 text-amber-400" />
                      عرض التفاصيل
                    </span>
                  </div>
                </div>

                {/* Product Content */}
                <div className="p-5 flex flex-col flex-1 justify-between gap-4 text-right">
                  <div>
                    {/* Rating placeholder */}
                    <div className="flex items-center justify-end gap-1 mb-1.5 text-amber-400">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium mr-1">(4.9)</span>
                    </div>

                    <h3
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Price & Add to Cart */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-normal">السعر</span>
                      <span className="text-lg font-black text-amber-400">
                        ${Number(p.price).toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p._id)}
                      className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 px-4 py-2 rounded-xl font-bold text-xs shadow-md shadow-amber-500/15 hover:shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>إضافة</span>
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

export default Categories;
