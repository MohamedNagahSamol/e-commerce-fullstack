import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import axiosInstance from "../axios/axiosInstance";
import Cookies from "js-cookie";
import { useEffect } from "react";
const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState("login");
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    if (Cookies.get("accessToken")) navigate("/");
  }, [navigate]);
  const handleConfirmLogin = async (e) => {
    e.preventDefault();
    let newUrl;
    if (!formData.name || !formData.email || !formData.password) {
      alert("⚠️ يرجى ملء جميع بيانات الشحن");
      return;
    }
    if (state === "login") {
      newUrl = `/api/user/login`;
    } else {
      newUrl = `/api/user/register`;
    }

    try {
      const res = await axiosInstance.post(newUrl, formData);
      if (res.data.success) {
        Cookies.set("accessToken", res.data.token, { path: "/", secure: true, sameSite: "lax" });
        navigate("/");
      } else if (res.data.success === false) {
        const message = res.data?.message;
        setError(Array.isArray(message) ? message[0]?.msg : message || "مدخل غير صحيح. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      const message = err.response?.data?.message;
      setError(Array.isArray(message) ? message[0]?.msg : message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
    }
  };
  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-24 px-6 sm:px-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm p-10 pointer-events-none"></div>

      <div className="relative z-10 w-sm bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">تسجيل الدخول</h2>

        <form className="flex flex-col gap-6" onSubmit={(e) => handleConfirmLogin(e)}>
          <input
            type="text"
            name="name"
            placeholder="الاسم"
            value={formData.name}
            onChange={handleChange}
            required
            className="bg-white/30 p-2 rounded-xl text-black  placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <input
            type="email"
            name="email"
            placeholder="الايميل"
            value={formData.email}
            onChange={handleChange}
            required
            className="bg-white/30 p-2 rounded-xl text-black  placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="كلمه المرور"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-white/30 p-2 rounded-xl text-black  placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <Button variant="contained" type="submit" className="w-full rounded-4xl">
            تسجيل الدخول
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-300">
          ليس لديك حساب؟ {"  "}
          <span
            onClick={() => {
              navigate("/signup");
              setState("register");
            }}
            className="text-amber-400 font-semibold cursor-pointer hover:underline"
          >
            أنشاء حساب
          </span>
        </p>
      </div>
      {error && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-xl shadow-lg">
          {error}
        </div>
      )}
    </section>
  );
};
export default Login;
