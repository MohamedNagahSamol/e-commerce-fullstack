import { createContext, useEffect, useState, useCallback, useMemo } from "react";
const ShopContext = createContext();
import axiosInstance from "../axios/axiosInstance";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const ShopContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(Cookies.get("accessToken") || null);
  const [cartItem, setcartItem] = useState({});
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  useEffect(() => {
    if (Cookies.get("accessToken")) return;
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.post(`/api/user/refresh`, {}, { withCredentials: true });
        if (res.data?.success) {
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
          setcartItem(res.data?.cartData || {});
        }
      } catch (e) {
        console.log(e);
        setcartItem({});
      }
    };
    fetchCart();
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/api/product/list`);
        setAllProducts(res.data?.data || []);
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

  const addToCart = useCallback(async (id, quantity = 1) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setcartItem((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + qty,
    }));
    if (accessToken) {
      try {
        await axiosInstance.post(`/api/cart/add`, { id, quantity: qty });
      } catch (err) {
        console.log(err);
      }
    }
  }, [accessToken]);

  const removeFromCart = useCallback(async (id, removeAll = false) => {
    setcartItem((prev) => {
      const updated = { ...prev };
      if (removeAll || updated[id] <= 1) {
        delete updated[id];
      } else {
        updated[id]--;
      }
      return updated;
    });
    if (accessToken) {
      try {
        await axiosInstance.post(`/api/cart/remove`, { id, removeAll });
      } catch (err) {
        console.log(err);
      }
    }
  }, [accessToken]);

  const clearCart = useCallback(async () => {
    try {
      if (accessToken) {
        await axiosInstance.post(`/api/cart/clear`);
      }
      setcartItem({});
    } catch (err) {
      console.log(err);
    }
  }, [accessToken]);

  const getTotalCartAmount = useCallback(() => {
    if (!allProducts || !cartItem) return 0;
    return Object.entries(cartItem).reduce((total, [id, qty]) => {
      const product = allProducts.find((p) => p._id === id);
      return total + (product ? product.price * qty : 0);
    }, 0);
  }, [allProducts, cartItem]);

  const value = useMemo(() => ({
    all_products: allProducts,
    cartItem,
    addToCart,
    setcartItem,
    clearCart,
    removeFromCart,
    getTotalCartAmount,
    setAccessToken,
    accessToken,
  }), [allProducts, cartItem, addToCart, clearCart, removeFromCart, getTotalCartAmount, accessToken]);

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export { ShopContext };
export default ShopContextProvider;
