import mongoose from "mongoose";


export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://vohraanik82:anik8055@cluster0.gjvqxtl.mongodb.net/food-del").then(()=>{
        console.log("MongoDB connected");
    })
};

