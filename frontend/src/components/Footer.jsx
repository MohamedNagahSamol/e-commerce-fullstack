import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const FacebookIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const Footer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`شكراً لتواصلك معنا، ${formData.name}`);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="relative w-full min-h-screen bg-linear-to-r from-teal-900 via-teal-800 to-amber-900 text-white py-24 px-6 sm:px-10">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl  mx-auto">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center">
          تواصل معنا
        </h2>
        <p className="text-gray-300 mb-12 text-center text-lg sm:text-xl">
          نحن هنا لمساعدتك في أي وقت، أرسل لنا رسالة وسنعود إليك قريباً!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2  gap-12">
          <div className="space-y-8">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg hover:shadow-amber-400/30 transition-all">
              
                <MapPin className="w-8 h-8 text-amber-400" />
               
                  <div>
                    <h4 className="font-semibold text-lg">العنوان</h4>
                    <p className="text-gray-300">صنصفط منوف مركز المنوفيه</p>
                  </div>
                </div>
              
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg hover:shadow-amber-400/30 transition-all">
                <Phone className="w-8 h-8 text-amber-400" />

                <div>
                  <h4 className="font-semibold text-lg">الهاتف</h4>
                  <p className="text-gray-300">+123 456 7890</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-lg hover:shadow-amber-400/30 transition-all">
                <Mail className="w-8 h-8 text-amber-400" />

                <div>
                  <h4 className="font-semibold text-lg">البريد الإلكتروني</h4>
                  <p className="text-gray-300">support@ecommerce.com</p>
                </div>
              </div>
            </div>
            <form
              onSubmit={handleSubmit}
              className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-2xl flex flex-col gap-6"
            >
              <input
                type="text"
                name="name"
                placeholder="ادخل الاسم الخاص بك"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-white/10 p-4 rounded-xl text-black placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all "
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="ادخل الايميل الخاص بك"
                onChange={handleChange}
                required
                className="bg-white/10 p-4 rounded-xl text-black placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all "
              />

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="اكتب الرساله هنا"
                rows={5}
                className="bg-white/10 p-4 rounded-xl text-black placeholder-gray-700 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all "
              ></textarea>
              <button
                type="submit"
                className="bg-linear-to-r from-teal-600 via-amber-500 to-amber-400 px-6 py-3 rounded-2xl 
              font-semibold text-white hover:opacity-90 transition-all shadow-lg  cursor-pointer"
              >
                ارسال الرساله
              </button>
            </form>
          </div>
        </div>
        <footer className="mt-24 relative z-10 max-w-7xl mx-auto text-center text-gray-300">
          <p className="mb-4">جميع الحقوق محفوظه@ 2025</p>
          <div className="flex justify-center gap-6">
            <a href="" className="hover:text-white transition-colors">
              <FacebookIcon />
            </a>
            <a href="" className="hover:text-white transition-colors">
              <XIcon />
            </a>
            <a href="" className="hover:text-white transition-colors">
              <InstagramIcon />
            </a>
            <a href="" className="hover:text-white transition-colors">
              <LinkedInIcon />
            </a>
          </div>
        </footer>
     
    </section>
  );
};

export default Footer;
