import jwt from "jsonwebtoken";
import usermodule from "../module/usermodule.js";

const requredAuth = async (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "no token" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await usermodule.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "token not vaild" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

const adminAuth = async (req, res, next) => {
  const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "no admin token provided" });
  }
  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await usermodule.findById(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "token not vaild" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ message: "unauthorized: admin role required" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

export { requredAuth, adminAuth };
