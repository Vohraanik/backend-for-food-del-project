import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Token creation function
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET);
}

// Login function
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }

        const token = createToken(user._id);
        res.status(200).json({
            message: "Logged in successfully",
            success: true,
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

// Register function
const registerUser = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({
                message: "User already exists",
                success: false,
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                message: "Please enter valid email",
                success: false
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password should be at least 8 characters",
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedpassword,
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
}

export { loginUser, registerUser };
