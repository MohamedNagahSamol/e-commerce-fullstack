import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosinstance from "../axios/axiosInstance";
function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("adminToken");
    if (token) {
      navigate("/admin/list");
    }
  }, [navigate]);
  const handelsubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosinstance.post(
        `/api/admin/login`,
        {
          email,
          password,
        },
      );
      if (data.success) {
        Cookies.set("adminToken", data.adminToken, { path: "/", secure: true, sameSite: "lax" });
        navigate("/admin/list");
      } else if (data.success === false) {
        setError(data.message || data.error);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
      console.log(err);
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 relative overflow-hidden">
      <div className="absolute w-72 h-72 bg-pink-500 rounded-full blur-3xl opacity-20 top-20 left-20 animate-pulse"></div>

      <form
        onSubmit={handelsubmit}
        className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 rounded-2xl text-white w-96 flex flex-col items-center transition-all duration-300 hover:scale-[1.02]"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">Admin Login</h2>

        <input
          type="email"
          placeholder="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="
        w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/20 placeholder-gray-300 focus:outline-none
         focus:ring-2 focus:ring-pink-400 text-white"
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="
        w-full p-3 mb-4 rounded-lg bg-white/20 border border-white/20 placeholder-gray-300 focus:outline-none
         focus:ring-2 focus:ring-pink-400 text-white"
        />
        <button
          type="submit"
          className="w-full bg-linear-to-r from-teal-600 via-teal-500 to-amber-400
        p-3 rounded-lg font-semibold shadow-lg hover:shadow-pink-500/30 transition-all duration-300 hover:scale[1.03]"
        >
          Login
        </button>
      </form>
      {error && (
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white p-4 rounded-xl shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}

export default AdminLogin;
