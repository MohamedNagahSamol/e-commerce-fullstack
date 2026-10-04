import { useState } from "react";
import axiosinstance from "../axios/axiosInstance";
import toast from "react-hot-toast";
import { Upload, Plus, Loader2 } from "lucide-react";

const Add = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
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
    if (!image) {
      toast.error("يرجى اختيار صورة للمنتج");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    try {
      const res = await axiosinstance.post(`/api/product/add`, formData);
      if (res.data.success) {
        setData({ name: "", description: "", price: "", category: "" });
        setImage(null);
        toast.success("تمت إضافة المنتج بنجاح إلى المتجر!");
      } else {
        const msg = res.data.errors?.[0]?.msg || res.data.message || "فشلت إضافة المنتج";
        toast.error(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "حدث خطأ أثناء الرفع";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-slate-950 text-white md:pl-64 pt-20 md:pt-10 pb-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="pb-6 border-b border-slate-900 text-right">
          <h1 className="text-2xl sm:text-3xl font-black text-white">إضافة منتج جديد</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            أدخل تفاصيل ومواصفات المنتج وارفع صورته ليظهر فوراً في واجهة المتجر.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={onSubmitHandler} className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 text-right">
          {/* Image Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">صورة المنتج الرئيسية *</label>
            <div className="border-2 border-dashed border-slate-800 hover:border-amber-400/50 rounded-2xl p-6 flex flex-col items-center justify-center transition-all bg-slate-950/60 relative">
              {image ? (
                <div className="flex flex-col items-center space-y-3">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="معاينة الصورة"
                    className="w-36 h-36 object-contain rounded-xl bg-slate-900 p-2 border border-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="text-xs text-red-400 hover:underline cursor-pointer font-bold"
                  >
                    تغيير أو حذف الصورة
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center space-y-2 text-center w-full">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center border border-slate-800">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">اضغط هنا لاختيار صورة المنتج</span>
                    <span className="text-xs text-slate-500">يدعم صيغ JPG, PNG, WEBP حتى 5 ميجابايت</span>
                  </div>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png, .gif, .webp"
                    name="image"
                    onChange={onImageChange}
                    className="hidden"
                    required
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">اسم المنتج *</label>
              <input
                type="text"
                name="name"
                placeholder="مثال: سماعة بلوتوث لاسلكية عازلة للضوضاء"
                value={data.name}
                onChange={onChangeHandler}
                required
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">وصف ومميزات المنتج *</label>
              <textarea
                name="description"
                placeholder="اكتب تفاصيل المنتج ومواصفاته الفنية هنا..."
                value={data.description}
                onChange={onChangeHandler}
                required
                rows={4}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">السعر بالدولار ($) *</label>
                <input
                  type="number"
                  name="price"
                  placeholder="29.99"
                  value={data.price}
                  onChange={onChangeHandler}
                  step="0.01"
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">الفئة / التصنيف *</label>
                <select
                  name="category"
                  value={data.category}
                  onChange={onChangeHandler}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400 text-sm transition-all cursor-pointer"
                >
                  <option value="">اختر الفئة...</option>
                  <option value="Men">Men (رجالي)</option>
                  <option value="Women">Women (حريمي)</option>
                  <option value="Kids">Kids (أطفال)</option>
                  <option value="Electronics">Electronics (إلكترونيات)</option>
                  <option value="Cosmetics">Cosmetics (مستحضرات تجميل)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black py-4 px-6 rounded-2xl shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-sm disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري رفع وتخزين المنتج...</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>إضافة المنتج للمتجر الآن</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Add;
