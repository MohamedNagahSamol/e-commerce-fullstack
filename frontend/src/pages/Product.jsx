import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { ShoppingBag, Star, ShieldCheck, Truck, RefreshCw, ChevronLeft, ArrowRight } from "lucide-react";

const Product = () => {
  const { addToCart, all_products } = useContext(ShopContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const product = (all_products || []).find((p) => p._id === id);

  const [selectedColor, setSelectedColor] = useState("Black");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!product) {
    return (
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-white bg-slate-950 px-4 text-center">
        <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold mb-3">المنتج المطلوب غير متوفر حالياً</h2>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          ربما تم نقل المنتج أو حذفه من قبل المشرفين، يرجى تصفح بقية المنتجات في متجرنا.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-amber-400 text-slate-950 px-6 py-3 rounded-xl font-bold hover:bg-amber-300 transition-all cursor-pointer"
        >
          <span>العودة للمتجر</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    );
  }

  const isClothing = ["men", "women", "kids"].includes(product.category?.toLowerCase() || "");

  const handleAddToCart = () => {
    addToCart(id, quantity);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  return (
    <section className="relative w-full min-h-screen bg-slate-950 text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-8 overflow-x-auto py-2">
          <Link to="/" className="hover:text-amber-400 transition-colors">الرئيسية</Link>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>{product.category || "منتجات"}</span>
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-semibold truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
          {/* Image Showcase Column */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full aspect-square rounded-2xl bg-slate-950/80 border border-slate-800/80 p-8 flex items-center justify-center relative overflow-hidden group">
              {product.category && (
                <span className="absolute top-4 right-4 z-10 px-3 py-1 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs font-bold text-amber-400">
                  {product.category}
                </span>
              )}
              <img
                src={product.image}
                alt={product.name}
                className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl"
              />
            </div>

            {/* Trust Mini-Cards */}
            <div className="w-full grid grid-cols-3 gap-3 mt-6">
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                <Truck className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                <span className="text-[11px] text-slate-300 font-medium block">توصيل سريع</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                <span className="text-[11px] text-slate-300 font-medium block">أصلي 100%</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-center">
                <RefreshCw className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                <span className="text-[11px] text-slate-300 font-medium block">إرجاع خلال 14 يوم</span>
              </div>
            </div>
          </div>

          {/* Product Info & Actions Column */}
          <div className="lg:col-span-7 flex flex-col justify-between text-right space-y-6">
            <div className="space-y-4">
              {/* Rating */}
              <div className="flex items-center justify-end gap-1.5 text-amber-400">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-bold mr-1">4.9 (128 تقييم حقيقي)</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <span className="text-xs bg-red-500/10 border border-red-500/30 text-red-400 px-2.5 py-1 rounded-lg font-bold">
                  خصم خاص
                </span>
                <span className="text-slate-500 line-through text-sm">
                  ${(Number(product.price) * 1.25).toFixed(2)}
                </span>
                <span className="text-3xl font-black text-amber-400">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>

              {/* Description */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">الوصف والمواصفات:</h4>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/40 p-4 rounded-2xl border border-slate-850">
                  {product.description}
                </p>
              </div>

              {/* Apparel Colors (Shown if category fits) */}
              {isClothing && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400">اختر اللون:</h4>
                  <div className="flex items-center justify-end gap-3">
                    {[
                      { name: "Black", bg: "#0f172a", border: "border-slate-700" },
                      { name: "White", bg: "#f8fafc", border: "border-slate-400" },
                      { name: "Blue", bg: "#2563eb", border: "border-blue-400" },
                      { name: "Red", bg: "#dc2626", border: "border-red-400" },
                    ].map((col) => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col.name)}
                        style={{ backgroundColor: col.bg }}
                        aria-label={col.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${col.border} ${
                          selectedColor === col.name ? "ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-110" : "opacity-80 hover:opacity-100"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Apparel Sizes */}
              {isClothing && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold text-slate-400">المقاس:</h4>
                  <div className="flex items-center justify-end gap-2.5">
                    {["S", "M", "L", "XL", "XXL"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedSize === size
                            ? "bg-amber-400 border-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-105"
                            : "bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Picker */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400">الكمية المطلوبة:</h4>
                <div className="flex items-center justify-end gap-3">
                  <div className="inline-flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer text-base"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-bold text-base font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-9 h-9 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center cursor-pointer text-base"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Add to Cart Action */}
            <div className="pt-6 border-t border-slate-800/80 space-y-3">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-4 px-8 rounded-2xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-base sm:text-lg"
              >
                <ShoppingBag className="w-6 h-6" />
                <span>إضافة إلى سلة المشتريات (${(Number(product.price) * quantity).toFixed(2)})</span>
              </button>

              {addedSuccess && (
                <div className="text-center bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold p-3 rounded-xl animate-fade-in">
                  ✓ تم إضافة المنتج إلى السلة بنجاح!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;
