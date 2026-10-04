import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { PlusCircle, List, ClipboardCheck, Menu, X, LogOut, Bell, Users as UsersIcon, ShieldAlert } from "lucide-react";
import Cookies from "js-cookie";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { to: "/admin/list", label: "قائمة المنتجات", Icon: List },
    { to: "/admin/add", label: "إضافة منتج جديد", Icon: PlusCircle },
    { to: "/admin/orders", label: "طلبات العملاء", Icon: ClipboardCheck },
    { to: "/admin/users", label: "إدارة المستخدمين", Icon: UsersIcon },
    { to: "/admin/notification", label: "مركز الإشعارات", Icon: Bell },
  ];

  const handleLogout = () => {
    Cookies.remove("adminToken", { path: "/" });
    Cookies.remove("adminToken");
    navigate("/admin/login");
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/90 border-b border-slate-800 backdrop-blur-xl z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black">
            A
          </div>
          <span className="font-bold text-white text-sm">لوحة الإدارة</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="القائمة"
          className="p-2 rounded-xl bg-slate-900 border border-slate-850 text-white cursor-pointer"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-950 border-r border-slate-800/80 z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between py-6 px-4 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-800/80 pb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wider">لوحة الإدارة</h2>
              <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-widest block">
                Shopping Dashboard
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {menuItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 justify-center w-full px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
