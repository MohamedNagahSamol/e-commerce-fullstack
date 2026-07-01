

function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-white">404</h1>
        <p className="text-2xl text-gray-300 mt-4">الصفحه غير موجوده</p>
        <a
          href="/"
          className="inline-block mt-6 px-5 py-3 bg-amber-400 text-white rounded-lg shadow-lg hover:bg-amber-500 transition-colors duration-300"
        >
          العودة للرئيسيه
        </a>
      </div>
    </div>
  )
}

export default NotFound