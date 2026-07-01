import express from "express";
import { addToCart, removeFromCart, getCart, clearCart } from "../controllers/cartController.js";
import { requredAuth } from "../middleware/authMiddleware.js";
import { cartLimiter } from "../config/ratelimte.js";
import { addToCartValidator, removeFromCartValidator } from "../config/validators.js";

const cartRoutes = express.Router();

cartRoutes.use(cartLimiter);

cartRoutes.post("/add", requredAuth, addToCartValidator, addToCart);
cartRoutes.post("/remove", requredAuth, removeFromCartValidator, removeFromCart);
cartRoutes.get("/get", requredAuth, getCart);
cartRoutes.post("/clear", requredAuth, clearCart);

export default cartRoutes;
