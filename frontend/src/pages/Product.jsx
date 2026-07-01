import { useParams } from "react-router-dom";
import { useState, useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Button from "@mui/material/Button";
const Product = () => {
  const { addToCart, all_products } = useContext(ShopContext);
  const { id } = useParams();
  const product = all_products.find((p) => p._id === id);
  const [selectedColor, setSelectedColor] = useState("Red");
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <section className="min-h-screen flex items-center justify-center text-white bg-linear-to-r from-teal-900 via-teal-800 to-amber-900">
        <p className="text-2xl font-bold">المنتج غير موجود 😢</p>
      </section>
    );
  }

  const handleAddToCart = () => {
    addToCart(id, quantity);
  };

  return (
    <section className="relative w-full  min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-12 flex items-center justify-center px-6 sm:px-10">
      <div className="absolute inset-0 max-w-7xl mx-auto my-16 bg-white/10 backdrop-blur-md rounded-3xl p-20 flex gap-10 shadow-2xl"></div>
      <div className=" z-10 relative flex flex-col md:flex-row w-full gap-10 py-10">
        <div className="md:w-1/3 flex items-center ml-7 justify-center bg-white/5 rounded-3xl p-3">
          <img src={product.image} className="w-60 h-64 object-contain rounded-2xl" />
        </div>

        <div className="flex-1 flex flex-col gap-5 ">
          <h3 className="text-3xl font-extrabold">{product.name}</h3>
          <p className="text-gray-300 text-lg">{product.description}</p>
          <p className="text-amber-400 text-3xl font-bold">price: ${product.price}</p>
          <p className="text-gray-200 text-lg">Category: {product.category}</p>

          <div>
            <h4 className="font-semibold mb-2">Color:</h4>
            <div className="flex gap-4">
              {["Red", "Blue", "Green", "Black", "white"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 border-white transition-all 
                    ${selectedColor === color ? "scale-125 border-amber-500" : ""}`}
                  style={{ backgroundColor: color.toLowerCase() }}
                ></button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Size:</h4>
            <div className="flex gap-4">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-8 h-8 rounded-full border-2 border-white transition-all 
               ${selectedSize === size ? "scale-125 border-amber-500" : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <h4 className="font-semibold">Quantity</h4>

            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-white/20 px-3 py-1 rounded-xl hover:bg-white/30 transition-all"
            >
              -
            </button>

            <span className="px-3">{quantity}</span>

            <button
              onClick={() => setQuantity(quantity + 1)}
              className="bg-white/20 px-3 py-1 rounded-xl hover:bg-white/30 transition-all"
            >
              +
            </button>
          </div>
          <Button
            variant="contained"
            onClick={() => {
              handleAddToCart();
              setQuantity(1);
            }}
            className="hover:opacity-85  transition-all p-3 w-1/4"
          >
            اضف الي السله
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Product;
