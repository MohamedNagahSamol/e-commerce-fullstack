import "./App.css";
import { Route, Routes } from "react-router-dom";
import Order from "./pages/Order";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Product from "./pages/Product";
import Verify from "./pages/Verify";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Layout from "./pages/Layout";
import MyOrder from "./pages/MyOrder";
import Notification from "./components/Notification";
import Profile from "./pages/Profile";
import ShopContextProvider from "./context/ShopContext";
import ResetPassword from "./pages/ResetPassword";
function App() {
  return (
    <>
      <ShopContextProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/order" element={<Order />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/cartshop" element={<Cart />} />
            <Route path="/myorder" element={<MyOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </ShopContextProvider>
    </>
  );
}

export default App;
