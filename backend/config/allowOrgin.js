const allowedOrigin = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:4000",
  "https://e-commerce-fullstack-nm2o.vercel.app",
  "https://e-commerce-production-4f51.up.railway.app",
  "https://e-commerce-fullstack-36uf.vercel.app",
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
];

export default allowedOrigin;
