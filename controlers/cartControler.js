import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    console.log(req.body,"id");
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        let cartData = userData.cartData || {};

        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        res.status(200).json({ message: "Item added to cart", success: true });

    } catch (error) {
        res.status(500).json({
            message: "Error adding item to cart",
            success: false,
        });
    }
};




// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        let cartData = userData.cartData || {};

        if (cartData[req.body.itemId] && cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
            if (cartData[req.body.itemId] === 0) {
                delete cartData[req.body.itemId];
            }
        }

        await userModel.findByIdAndUpdate(req.body.userId, { cartData });

        res.status(200).json({ message: "Item removed from cart", success: true });

    } catch (error) {
        res.status(500).json({
            message: "Error removing item from cart",
            success: false,
        });
    }
};

// Get user cart data
const getCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        if (!userData) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        let cartData = userData.cartData || {};
        res.status(200).json({ message: "Cart data fetched", success: true, cartData });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching cart data",
            success: false,
        });
    }
};

export { addToCart, removeFromCart, getCart };



