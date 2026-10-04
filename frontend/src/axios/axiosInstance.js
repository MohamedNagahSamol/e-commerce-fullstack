import axios from "axios";
import Cookies from "js-cookie";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://e-commerce-production-4f51.up.railway.app",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/api/user/refresh")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axiosInstance.post("/api/user/refresh");
        if (res.data?.success && res.data?.token) {
          Cookies.set("accessToken", res.data.token, { path: "/", secure: true, sameSite: "lax" });
          originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
          return axiosInstance(originalRequest);
        }
      } catch {
        Cookies.remove("accessToken");
        if (window.location.pathname !== "/login" && window.location.pathname !== "/signup") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
