import jwt from "jsonwebtoken";


const authMiddleware = async (req, res, next) => {
    console.log("token",req.headers.token);
    
    try {
        const { token } = req.headers;
        if (!token) {
            return res.status(401).json(
                {
                    message: "Not Authorized Login Again",
                    success: false
                }
            );
        }
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId = token_decode.id;
        next();


    } catch (error) {
        console.log(error);
        return res.status(500).json(
            {
                message: "error" + error,
                success: false
            }
        );
    }
}

export default authMiddleware;