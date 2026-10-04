import Add from "./components/Add";
import List from "./components/List";
import Sidebar from "./components/Sidebar";
import Orders from "./components/Orders";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProductedRoute";
import AdminLogin from "./components/AdminLogin";
import { Toaster } from "react-hot-toast";
import Users from "./components/Users";
import Notification from "./components/Notification";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {!isLoginPage && <Sidebar />}
      <Routes>
        <Route path="/" element={<Navigate to="/admin/list" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/add"
          element={
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/list"
          element={
            <ProtectedRoute>
              <List />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notification"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/admin/list" replace />} />
      </Routes>
    </>
  );
}
export default App;
