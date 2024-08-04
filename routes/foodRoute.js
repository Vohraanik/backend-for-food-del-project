import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood } from "../controlers/foodControler.js";

const foodRouter = express.Router();

// Image storage engine
const storage = multer.diskStorage({
    destination: "upload",
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.delete("/remove/:item_id",removeFood);

export default foodRouter;
