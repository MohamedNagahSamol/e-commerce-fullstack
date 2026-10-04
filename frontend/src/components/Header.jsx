import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import MenuItem from "./MenuItem";
import { Link } from "react-router-dom";

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <header
        className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
          scrolled
            ? "h-16 md:h-20 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/40"
            : "h-18 md:h-20 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5 text-slate-950" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-white font-extrabold text-xl tracking-tight group-hover:text-amber-400 transition-colors">
                  SHOPPING
                </span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 -mt-1 font-medium">
                Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <MenuItem isMobile={false} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="فتح القائمة"
              className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-slate-950/95 border-l border-slate-800/80 shadow-2xl backdrop-blur-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-white font-bold text-lg">قائمة المتجر</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="إغلاق القائمة"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <MenuItem setSidebaropen={setSidebarOpen} isMobile={true} />
        </div>
      </aside>
    </>
  );
}

export default Header;
