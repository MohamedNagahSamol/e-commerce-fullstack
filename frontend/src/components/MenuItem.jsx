/* eslint-disable react-refresh/only-export-components */
import { useNavigate, useLocation } from "react-router-dom";
import { Home, ShoppingBag, Mail, ShoppingCart, Package, Bell, User, LogOut, LogIn, Sparkles } from "lucide-react";
import { useContext } from "react";
import { Link as ScrollLink } from "react-scroll";
import { ShopContext } from "../context/ShopContext";
import Cookies from "js-cookie";
import axiosInstance from "../axios/axiosInstance";

export const MenuItemData = [
  { to: "home", label: "الرئيسية", Icon: Home },
  { to: "categories", label: "التصنيفات", Icon: ShoppingBag },
  { to: "features", label: "المميزات", Icon: Sparkles },
  { to: "contact", label: "تواصل معنا", Icon: Mail },
];

function MenuItem({ setSidebaropen, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = Cookies.get("accessToken");
  const { cartItem, setAccessToken } = useContext(ShopContext);

  const totalItemCount = Object.values(cartItem || {}).reduce(
    (acc, qty) => acc + (Number(qty) || 0),
    0
  );

  const handleLogout = async () => {
    try {
      await axiosInstance.post(`/api/user/logout`);
    } catch (err) {
      console.log(err);
    } finally {
      Cookies.remove("accessToken");
      setAccessToken(null);
      if (setSidebaropen) setSidebaropen(false);
      navigate("/login");
    }
  };

  const handleNavClick = (sectionId) => {
    if (setSidebaropen) setSidebaropen(false);
    if (location.pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-2">
        {/* Navigation Links */}
        <div className="space-y-1 pb-4 border-b border-slate-800/80">
          <p className="text-xs font-semibold text-slate-400 px-3 pb-2 uppercase tracking-wider">
            التنقل السريع
          </p>
          {MenuItemData.map((item) => (
            <button
              key={item.to}
              onClick={() => handleNavClick(item.to)}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-slate-900 transition-all text-sm font-semibold cursor-pointer"
            >
              <item.Icon className="w-5 h-5 text-amber-400" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Actions */}
        <div className="space-y-1 pt-2">
          <p className="text-xs font-semibold text-slate-400 px-3 pb-2 uppercase tracking-wider">
            حسابك وطلباتك
          </p>

          <button
            onClick={() => {
              navigate("/cartshop");
              if (setSidebaropen) setSidebaropen(false);
            }}
            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-slate-900 transition-all text-sm font-semibold cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-5 h-5 text-emerald-400" />
              <span>سلة المشتريات</span>
            </div>
            {totalItemCount > 0 && (
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2 py-0.5 rounded-full shadow-sm">
                {totalItemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              navigate("/myorder");
              if (setSidebaropen) setSidebaropen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-slate-900 transition-all text-sm font-semibold cursor-pointer"
          >
            <Package className="w-5 h-5 text-blue-400" />
            <span>طلباتي</span>
          </button>

          <button
            onClick={() => {
              navigate("/notification");
              if (setSidebaropen) setSidebaropen(false);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-slate-900 transition-all text-sm font-semibold cursor-pointer"
          >
            <Bell className="w-5 h-5 text-purple-400" />
            <span>الإشعارات</span>
          </button>

          {accessToken ? (
            <>
              <button
                onClick={() => {
                  navigate("/profile");
                  if (setSidebaropen) setSidebaropen(false);
                }}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-slate-200 hover:text-white hover:bg-slate-900 transition-all text-sm font-semibold cursor-pointer"
              >
                <User className="w-5 h-5 text-cyan-400" />
                <span>الملف الشخصي</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                if (setSidebaropen) setSidebaropen(false);
              }}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold hover:shadow-lg hover:shadow-amber-500/20 transition-all text-sm cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Desktop Menu
  return (
    <div className="flex items-center gap-1.5 lg:gap-3">
      {/* Scroll / Nav Links */}
      <nav className="flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 p-1.5 rounded-2xl backdrop-blur-md">
        {MenuItemData.map((item) =>
          location.pathname === "/" ? (
            <ScrollLink
              key={item.to}
              to={item.to}
              smooth={true}
              duration={500}
              offset={-80}
              spy={true}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              activeClass="text-amber-400 bg-amber-400/10 font-bold shadow-sm"
            >
              <item.Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </ScrollLink>
          ) : (
            <button
              key={item.to}
              onClick={() => handleNavClick(item.to)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <item.Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          )
        )}
      </nav>

      <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

      {/* Orders link */}
      <button
        onClick={() => navigate("/myorder")}
        title="طلباتي"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all cursor-pointer"
      >
        <Package className="w-4 h-4 text-slate-400" />
        <span className="hidden xl:inline">طلباتي</span>
      </button>

      {/* Notifications */}
      <button
        onClick={() => navigate("/notification")}
        title="الإشعارات"
        className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all relative cursor-pointer"
      >
        <Bell className="w-4.5 h-4.5" />
      </button>

      {/* Cart Button */}
      <button
        onClick={() => navigate("/cartshop")}
        title="سلة التسوق"
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400/40 text-slate-200 hover:text-white transition-all relative cursor-pointer group"
      >
        <ShoppingCart className="w-4.5 h-4.5 text-amber-400 group-hover:scale-110 transition-transform" />
        <span className="text-xs lg:text-sm font-bold hidden sm:inline">السلة</span>
        {totalItemCount > 0 && (
          <span className="bg-amber-400 text-slate-950 font-black text-[11px] px-1.5 py-0.2 rounded-full min-w-5 h-5 flex items-center justify-center shadow-md animate-pulse">
            {totalItemCount}
          </span>
        )}
      </button>

      {/* User Auth Buttons */}
      {accessToken ? (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate("/profile")}
            title="الملف الشخصي"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent hover:border-slate-700/60 transition-all cursor-pointer"
          >
            <User className="w-4.5 h-4.5 text-cyan-400" />
          </button>
          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="p-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          <span>دخول</span>
        </button>
      )}
    </div>
  );
}

export default MenuItem;
