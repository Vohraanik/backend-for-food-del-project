import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:3000";
    console.log(req.body,"sdsds");
    
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.total,
            address: req.body.adress
        });
        await newOrder.save();

        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                },
                unit_amount: item.price * 100,
            },
            quantity: item.quantity,
        }));

        line_items.push({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: "Delivery Fee",
                },
                unit_amount: 2 * 100 * 80,
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        });



        res.status(200).json({
            session_url: session.url,
            success: true,
            message: "Order placed successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to place order",
        });
    }
};

const verifyOrder = async (req, res) => {
    console.log(req.body, "gjhg");
    try {
        const { orderId, success } = req.body;
        console.log(`Received orderId: ${orderId}, success: ${success}`);

        if (success === 'true') {      
            const updateResult = await orderModel.findByIdAndUpdate(orderId, { payment: true }, { new: true });
            console.log(`Update result: ${updateResult}`);
            res.status(200).json({
                success: true,
                message: "Order verified successfully",
            });
        } else {          
            const deleteResult = await orderModel.findByIdAndDelete(orderId);
            console.log(`Delete result: ${deleteResult}`);
            res.status(200).json({
                success: false,
                message: "Order cancelled successfully",
            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to verify order",
        });
    }
}

// user orders for frontend
const userOrder = async (req,res) => {
    console.log(req.body,"userorder");
    
    try {
        const orders = await orderModel.find({userId: req.body.userId});
        res.status(200).json({
            success: true,
            data: orders
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
            });
        
    }
}

//listing order for admin panel

const listOrder = async (req,res) => {
    try {
        const order = await orderModel.find();
        res.status(200).json({
            success: true,
            data: order,
            message:"order listed sucessfuly"
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message:"error "+error.message
            });
        
    }
}


//api for updating order status

const updateStatus = async (req,res) => {  
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.status(200).json({
            success: true,
            message: "Order status updated successfully"
            });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status"
            });
        
    }

}



export { placeOrder, verifyOrder ,userOrder,listOrder,updateStatus};
