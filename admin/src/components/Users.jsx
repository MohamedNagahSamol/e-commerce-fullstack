import { useState, useEffect } from "react";
import axiosinstance from "../axios/axiosInstance";
import { Trash2, User, Shield, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUsers = async () => {
      try {
        const res = await axiosinstance.get(`/api/admin/all`, { signal });
        if (res.data.success) {
          setUsers(res.data.data);
          setLoading(false);
          toast.success("Users fetched successfully");
        } else if (!res.data.success) {
          toast.error(res.data.message || res.data.error);
          setLoading(false);
        }
      } catch (err) {
        console.log(err);
        toast.error(err.message || "Failed to fetch users");
        setLoading(false);
      }
    };
    fetchUsers();
    return () => controller.abort();
  }, []);
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axiosinstance.delete(`/api/admin/delete/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        toast.success(res.data.message || "User deleted successfully");
      } else if (!res.data.success) {
        toast.error(res.data.message || res.data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Failed to delete user");
    }
  };
  const handleMakeAdmin = async (userId) => {
    try {
      const res = await axiosinstance.post(`/api/admin/makeadmin/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role: "admin" } : user)));
        toast.success(res.data.message || "User updated to admin successfully");
      } else if (!res.data.success) {
        toast.error(res.data.message || res.data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Failed to update user to admin");
    }
  };
  const handleMakeUser = async (userId) => {
    try {
      const res = await axiosinstance.post(`/api/admin/makeuser/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.map((user) => (user._id === userId ? { ...user, role: "user" } : user)));
        toast.success(res.data.message || "User updated to regular user successfully");
      } else if (!res.data.success) {
        toast.error(res.data.message || res.data.error);
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Failed to update user to regular user");
    }
  };
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white px-6">
        <div className="flex flex-col items-center">
          <Loader2 className="w-20 h-20 animate-spin text-cyan-400 mb-6" />
          <h2 className="text-2xl font-semibold">Loading users...</h2>
          <p className="text-gray-300 mt-2"></p>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-linear-to-r  from-teal-900 via-teal-800 to-amber-900 min-h-screen px-3 py-5 ">
      <h1 className="text-3xl font-bold text-white mt-2 mb-4 text-center">Users Management</h1>
      {users.length === 0 ? (
        <p className="text-center text-gray-300 text-xl">No users found 😢</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-linear-to-b from-teal-700/70 to-transparent rounded-2xl shadow-lg p-4  flex flex-col justify-between hover:scale-105 transform transition-all duration-300"
            >
              <div>
                <h2 className="text-xl font-semibold mb-1 text-white">{user.email}</h2>
                <p className="mb-1 text-white">Role: {user.role}</p>
                <p className="mb-2 text-white">Created: {moment(user.createdAt).format("YYYY-MM-DD HH:mm:ss")}</p>
              </div>
              <div className="flex gap-4">
                {user.role !== "admin" && (
                  <button
                    onClick={() => handleMakeAdmin(user._id)}
                    className="flex items-center gap-2 bg-green-500 px-3 py-1 rounded-lg text-white hover:bg-green-600 transition-all"
                  >
                    <Shield className="w-4 h-4" />
                    Make Admin
                  </button>
                )}
                {user.role === "admin" && (
                  <button
                    onClick={() => handleMakeUser(user._id)}
                    className="flex items-center gap-2 bg-blue-500 px-3 py-1 rounded-lg text-white hover:bg-blue-600 transition-all"
                  >
                    <User className="w-4 h-4" />
                    Make User
                  </button>
                )}
                <button
                  onClick={() => handleDelete(user._id)}
                  className="flex items-center gap-2 bg-red-500 px-3 py-1 rounded-lg text-white hover:bg-red-600 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Users;
