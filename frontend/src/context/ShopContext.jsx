import { createContext, useEffect, useState } from "react";
const ShopContext = createContext();
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const ShopContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken") || null);
  const [cartItem, setcartItem] = useState([]);
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState();
  useEffect(() => {
    if (Cookies.get("accessToken")) return;
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.post(`/api/user/refresh`, {}, { withCredentials: true });
        if (res.data.success) {
          setAccessToken(res.data.token);
          Cookies.set("accessToken", res.data.token, { path: "/", secure: true, sameSite: "lax" });
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkAuth();
  }, [navigate]);
  useEffect(() => {
    const fetchCart = async () => {
      try {
        if (accessToken) {
          const res = await axiosInstance.get(`/api/cart/get`);
          setcartItem(res.data.cartData);
        }
      } catch (e) {
        console.log(e);
        setcartItem([]);
      } finally {
        console.log(cartItem);
      }
    };
    fetchCart();
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/product/list`);
        setAllProducts(res.data.data || []);
      } catch (err) {
        console.log(err);
        setAllProducts([]);
      }
    };
    fetchProduct();
  }, [accessToken]);

  useEffect(() => {
    try {
      localStorage.setItem("cartItems", JSON.stringify(cartItem));
    } catch (e) {
      console.log(e);
    }
  }, [cartItem]);

  const addToCart = async (id, quantity = 1) => {
    setcartItem((prev) => ({
      ...prev,
      [id]: prev[id] ? prev[id] + 1 : quantity,
    }));
    if (accessToken) {
      try {
        await axiosInstance.post(`/api/cart/add`, { id });
      } catch (err) {
        console.log(err);
      }
    }
  };
  const removeFromCart = async (id, removeAll = false) => {
    setcartItem((prev) => {
      const updated = { ...prev };
      if (removeAll || updated[id] === 1) delete updated[id];
      else updated[id]--;
      return updated;
    });
    if (accessToken) {
      try {
        if (removeAll) {
          await axiosInstance.post(`/api/cart/clear`);
        } else {
          await axiosInstance.post(`/api/cart/remove`, { id });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const clearCart = async () => {
    try {
      await axiosInstance.post(`/api/cart/clear`);
      setcartItem({});
    } catch (err) {
      console.log(err);
    }
  };
  const getTotalCartAmount = () => {
    return Object.entries(cartItem).reduce((total, [id, qty]) => {
      const product = allProducts.find((p) => p._id === id);
      return total + (product ? product.price * qty : 0);
    }, 0);
  };
  const value = {
    all_products: allProducts,
    cartItem,
    addToCart,
    setcartItem,
    clearCart,
    removeFromCart,
    getTotalCartAmount,
    setAccessToken,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export { ShopContext };
export default ShopContextProvider;
