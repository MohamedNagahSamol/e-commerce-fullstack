import { useState, useContext } from "react";
// Old code:
// import { categories } from "../assets/data";
// Reason: Specify the explicit file extension (.js) for clarity and ESM import convention.
// import { categories } from "../assets/data.js";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
function Categories() {
  const categories = [
    { name: "Men" },
    {
      name: "Women",
    },
    {
      name: "Kids",
    },
    {
      name: "Electronics",
    },
    {
      name: "Cosmetics",
    },
  ];
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState("All");
  const { addToCart, all_products } = useContext(ShopContext);
  const filterProdect =
    selectedCategories === "All" ? all_products : all_products.filter((p) => p.category == selectedCategories);

  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-24 px-6 sm:px-10">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-12">تسوق حسب الفئة</h2>

        <div className="flex flex-wrap justify-center gap-6 mb-16">
          <button
            onClick={() => setSelectedCategories("All")}
            className={`px-6 py-3 rounded-2xl font-semibold text-lg transition-all shadow-lg ${selectedCategories === "All"
                ? "bg-linear-to-r from-amber-400 to-yellow-500 text-white shadow-amber-400/50 scale-105"
                : "bg-white/10 hover:bg-white/20 text-gray-200"
              }`}
          >
            الكل
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => setSelectedCategories(c.name)}
              className={`px-6 py-3 rounded-2xl font-semibold text-lg
               transition-all shadow-lg ${selectedCategories === c.name
                  ? "bg-linear-to-r from-amber-400 to-yellow-500 text-white shadow-amber-400/50 cursor-pointer scale-105"
                  : "bg-white/10 hover:bg-white/20 text-gray-200"
                }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 lg:grid-cols-4">
          {filterProdect?.map((p) => (
            <div
              key={p._id}
              className="border bg-white/10 backdrop-blur-md border-white/20 rounded-3xl overflow-hidden shadow-2xl 
    hover:scale-105 hover drop-shadow-amber-400/30 transition-all duration-500"
            >
              <div
                onClick={() => navigate(`/product/${p._id}`)}
                className="w-full relative h-64 flex items-center justify-center bg-linear-to-b from-teal-800/40 to-transparent"
              >
                <img
                  src={p.image}
                  className="object-contain w-56 h-56 hover:scale-105 transition-transform duration-500 "
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
}

export default Categories;
