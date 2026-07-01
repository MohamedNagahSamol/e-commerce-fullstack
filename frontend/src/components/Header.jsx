import { useState, useEffect } from "react";
import { Rocket, Menu, X } from "lucide-react";
import MenuItem from "./MenuItem";
function Header() {
  const [Sidebaropen, setSidebaropen] = useState(false);
  useEffect(() => {
    const handleresize = () => {
      if (window.innerWidth >= 640) {
        setSidebaropen(false);
      }
    };
    window.addEventListener("resize", handleresize);
    handleresize();
    return () => window.removeEventListener("resize", handleresize);
  }, []);
  return (
    <>
      <header
        className="hidden h-12 md:flex items-center px-3 py-4 w-full fixed top-0 left-0 bg-linear-to-r from-teal-800
       via-teal-600 to-amber-800 backdrop-blur-lg shadow-2xl z-50"
      >
        <div className=" items-center gap-2 flex ">
          <Rocket className="w-6 h-6 text-amber-400 animate-pulse" />
          <h1 className="text-white font-bold text-xl tracking-widest">
          Shoping
          </h1>
        </div>
        <div className="flex-1 flex justify-center lg:justify-end">
          <MenuItem isMobile={false} />
        </div>
      </header>
      <header
        className="md:hidden h-9 flex justify-between items-center p-3 w-full fixed top-0 left-0 bg-linear-to-r
       from-teal-900 via-teal-800 to-amber-900 backdrop-blur-lg shadow-xl z-50"
      >
        <div className="flex items-center gap-2">
          <Rocket className="w-7 h-8 text-amber-400 animate-pulse" />
          <h1 className="text-white font-bold text-xl tracking-widest">
          Shoping
          </h1>
        </div>
        <button
          onClick={() => setSidebaropen(true)}
          className="text-white p-2 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          <Menu className="w-8 h-8 cursor-pointer" />
        </button>
      </header>
      <aside
        className={`fixed top-12 right-0 h-full w-72 bg-linear-to-b  from-teal-900 via-teal-800 to-amber-900 
        shadow-2xl backdrop-blur-xl transform transition-transform duration-500 z-40 ${Sidebaropen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setSidebaropen(false)}
            className="text-white p-3 hover:bg-white/20 rounded-lg transition-all duration-300"
          >
            <X className="w-7 h-7" />
          </button>
        </div>
        <div className=" px-5 space-y-6">
          <MenuItem setSidebaropen={setSidebaropen} isMobile={true}/>
        </div>
      </aside>
      {
        Sidebaropen && (
          <div className="sm:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={()=>setSidebaropen(false)}>

          </div>
        )
      }
    </>
  );
}

export default Header;
