import express from "express"
import { addToCart,removeFromCart,getCart } from "../controlers/cartControler.js"
import authMiddleware from "../middleware/auth.js";


const cartRouter = express.Router();

cartRouter.post("/add",authMiddleware,addToCart);
cartRouter.delete("/remove",authMiddleware,removeFromCart);
cartRouter.get("/get",authMiddleware,getCart);

export default cartRouter;