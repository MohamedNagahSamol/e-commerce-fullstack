import { useState } from "react";
import axiosinstance from "../axios/axiosInstance";
import toast from "react-hot-toast";
const Add = () => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };
  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    if (image) {
      formData.append("image", image);
    }
    try {
      const res = await axiosinstance.post(`/api/product/add`, formData);
      if (res.data.success) {
        setData({ name: "", description: "", price: "", category: "" });
        setImage(null);
        toast.success("Product added successfully");
      }else if (!res.data.success) {
        const msg = res.data.errors?.[0]?.msg || res.data.message || "Failed to add product";
        toast.error(msg);
      }
    } catch (err) {
      console.log(err);
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Failed to add product";
      toast.error(msg);
    }
  };
  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-14 px-6 sm:px-10">
      <form onSubmit={onSubmitHandler}>
        <div className="relative z-10 max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-7 rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold mb-6 text-center">إضافة منتج جديد</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="اسم المنتج"
              value={data.name}
              onChange={onChangeHandler}
              className={`w-full px-4 py-3 rounded-xl bg-white/15 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none`}
            />
            <input
              type="text"
              name="description"
              placeholder="وصف المنتج"
              value={data.description}
              onChange={onChangeHandler}
              className={`w-full px-4 py-3 rounded-xl bg-white/15 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none`}
            />
            <input
              type="number"
              name="price"
              placeholder="السعر"
              value={data.price}
              onChange={onChangeHandler}
              className={`w-full px-4 py-3 rounded-xl bg-white/15 text-white placeholder-gray-300 focus:ring-2 focus:ring-cyan-400 outline-none`}
            />
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              className={`w-full px-4 py-3 rounded-xl bg-black/30 text-white placeholder-teal-400 focus:ring-2 focus:ring-cyan-400 outline-none`}
            >
              <option value="">صنف</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              <option value="Electronics">Electronics</option>
              <option value="Cosmetics">Cosmetics</option>
            </select>
            Choose a image:
            <input
              accept=".jpg, .jpeg, .png, .gif, .bmp, .webp"
              className="inpdddut"
              id="arquivo"
              name="image"
              onChange={onImageChange}
              type="file"
            ></input>
            {image && <img src={URL.createObjectURL(image)} className=" h-50 mx-auto object-cover rounded-2xl mt-1" />}
            <button
              type="submit"
              className="w-full bg-linear-to-r from-teal-600 via-teal-500 to-amber-400 px-6 py-3 
              rounded-2xl font-semibold hover:opacity-90 transition-all text-white shadow-lg mt-1"
            >
              إضافه المنتج
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default Add;
