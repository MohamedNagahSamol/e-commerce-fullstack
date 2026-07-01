import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { ShopContext } from "../context/ShopContext";
import Cookies from "js-cookie";
import axiosInstance from "../axios/axiosInstance";
const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [state, setState] = useState("register");
  const { setAccessToken } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  useEffect(() => {
    if (Cookies.get("accessToken")) navigate("/");
  }, [navigate]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleConfirmSignup = async (e) => {
    let newUrl;
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("⚠️ يرجى ملء جميع بيانات الشحن");
      return;
    } else if (formData.password !== formData.confirmPassword) {
      alert("⚠️ يجب ان يكون كل من كلمه السر و تاكيد كلمه السر متطابقان");
      return;
    }
    if (state === "register") {
      newUrl = `/api/user/register`;
    } else {
      newUrl = `/api/user/login`;
    }
    const Data = { email: formData.email, password: formData.password, name: formData.name };
    try {
      const res = await axiosInstance.post(newUrl, Data);
      if (res.data.success) {
        Cookies.set("accessToken", res.data.token, { path: "/", secure: true, sameSite: "lax" });
        setAccessToken(res.data.token);
        navigate("/");
      } else if (res.data.success === false) {
        const message = res.data?.message;
        setError(
          Array.isArray(message)
            ? message[0]?.msg
            : message || "مدخل غير صحيح. يرجى المحاولة مرة أخرى.",
        );
      }
    } catch (err) {
      const message = err.response?.data?.message;
      setError(
        Array.isArray(message)? message[0]?.msg : message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
      );
      //
    }
  };
  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-24 px-6 sm:px-10 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm p-10 pointer-events-none"></div>
      <div className="w-sm z-10 relative bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-center">إنشاء حساب جديد</h2>

        <form className="flex flex-col gap-3" onSubmit={(e) => handleConfirmSignup(e)}>
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
            onChange={handleChange}
            value={formData.email}
            required
            className="bg-white/30 p-2 rounded-xl text-black placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="كلمه المرور"
            onChange={handleChange}
            value={formData.password}
            required
            className="bg-white/30 p-2 rounded-xl text-black placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="تاكيد كلمه المرور"
            onChange={handleChange}
            value={formData.confirmPassword}
            required
            className="bg-white/30 p-2 rounded-xl text-black placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <Button variant="contained" type="submit" className="w-full rounded-4xl">
            أنشاء حساب
          </Button>
        </form>
        <p className="mt-6 text-center text-gray-300">
          لديك حساب؟{"  "}
          <span
            onClick={() => {
              navigate("/login");
              setState("login");
            }}
            className="text-amber-400 font-semibold cursor-pointer hover:underline"
          >
            تسجيل الدخول
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

export default SignUp;
