import Add from "./components/Add";
import List from "./components/List";
import Sidebar from "./components/Sidebar";
import Orders from "./components/Orders";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProductedRoute";
import AdminLogin from "./components/AdminLogin";
import { Toaster } from "react-hot-toast";
import Users from "./components/Users";
import Notification from "./components/Notification";
function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false}  />
      <Sidebar />
      <Routes>
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
      </Routes>
    </>
  );
}
export default App;
