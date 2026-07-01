/* eslint-disable react-refresh/only-export-components */
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Mail, ShoppingCart, Package, Bell, User } from "lucide-react";
import { useContext } from "react";
import { Link as ScrollLink } from "react-scroll";
import { ShopContext } from "../context/ShopContext";
export const MenuItemData = [
  { to: "home", label: "Home", Icon: Home },
  { to: "shop", label: "Shop", Icon: ShoppingBag },
  { to: "contact", label: "Contact", Icon: Mail },
];
import Cookies from "js-cookie";
import axiosInstance from "../axios/axiosInstance";
function MenuItem({ setSidebaropen, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = Cookies.get("accessToken");
  const { cartItem } = useContext(ShopContext);
  const totalitem = Object.values(cartItem).reduce((a, b) => a + b, 0);
  const handelLogout = async () => {
    try {
      const res = await axiosInstance.post(`/api/user/logout`);
      if (res.data.success) {
        Cookies.remove("accessToken");
        navigate("/signup");
      } else {
        console.log(res.error || res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div
      className={`flex md:justify-center lg:justify-end ${
        isMobile ? "flex-col space-y-4 items-center px-4 gap-y-1" : "flex-row w-full items-center gap-2"
      }`}
    >
      {MenuItemData.map((i) =>
        location.pathname === "/" ? (
          <ScrollLink
            key={i.to}
            to={i.to}
            smooth={true}
            duration={500}
            offset={-80}
            spy={true}
            className="flex items-cente gap-1 px-1
           py-2 rounded-lg h-8.75 transition-all shrink w-auto min-w-13 text-gray-200 hover:bg-white/10 hover:text-white
           hover:shadow-md cursor-pointer"
            onClick={() => setSidebaropen && setSidebaropen(false)}
            activeClass="bg-gradient-to-r
            from-teal-600 to-amber-500 text-white shadow-lg"
          >
            <i.Icon className="w-6 h-6" />
            <span className="font-semibold text-base">{i.label}</span>
          </ScrollLink>
        ) : (
          <button
            key={i.to}
            onClick={() => {
              navigate("/");
              setSidebaropen && setSidebaropen(false);
            }}
            className="flex items-center gap-1 px-1 py-5 rounded-lg h-8.75 transition-all shrink w-auto  text-gray-200
             hover:bg-white/10 hover:shadow-md"
          >
            <i.Icon className="w-4 h-6" />
            <span className="font-semibold">{i.label}</span>
          </button>
        ),
      )}
      <button
        onClick={() => {
          navigate("/myorder");
        }}
        className="flex items-center gap-1 px-1 py-3 rounded-lg h-8.75 transition-all shrink w-auto min-w-15 text-gray-200 hover:bg-white/10 hover:shadow-md"
      >
        <Package className="w-5 h-6" />
        <span className="font-semibold text-base">Order</span>
      </button>
      <button
        onClick={() => {
          navigate("/cartshop");
          setSidebaropen && setSidebaropen(false);
        }}
        className="relative flex items-center gap-1 px-1 py-3 
      rounded-lg h-8.75 transition-all shrink w-auto min-w-7 text-gray-200 hover:bg-white/10 hover:shadow-md"
      >
        <ShoppingCart className="w-7 h-7" />
        {totalitem > 0 && Cookies.get("accessToken") && (
          <span
            className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-w bg-red-500 rounded-full flex 
      items-center justify-center"
          >
            {totalitem}
          </span>
        )}
      </button>
      <button
        onClick={() => {
          navigate("/notification");
          setSidebaropen && setSidebaropen(false);
        }}
        className="relative flex items-center gap-1 px-2 py-3 
      rounded-lg h-8.75 transition-all shrink w-auto min-w-3.5 text-gray-200 hover:bg-white/10 hover:shadow-md"
      >
        <Bell className="w-7 h-7" />
      </button>

      {accessToken && (
        <button
          onClick={() => {
            navigate("/profile");
            setSidebaropen && setSidebaropen(false);
          }}
          className="flex items-center gap-2 px-2 py-2 rounded-lg h-8.75 transition-all shrink w-auto min-w-3.5 text-gray-200 hover:bg-white/10 hover:shadow-md"
        >
          <User className="w-7 h-7" />
        </button>
      )}

      {!accessToken ? (
        <button
          onClick={() => {
            navigate("/login");
            setSidebaropen && setSidebaropen(false);
          }}
          className="flex items-center gap-2 
        px-4 py-3 rounded-lg h-8.75 bg-amber-400 text-white font-semibold hover:bg-amber-500 transition-all"
        >
          Login
        </button>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={handelLogout}
            className="flex items-center gap-2 px-4 py-3 rounded-lg h-8.75 bg-red-500 text-white 
          font-semibold hover:bg-red-600 transition-all"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default MenuItem;
