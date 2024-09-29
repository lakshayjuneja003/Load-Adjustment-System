import jwt from 'jsonwebtoken';
import { Admin } from '../schemas/adminSchema.js';

export const verifyJWT = async (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(403).json(
                { message: "Unauthorized Access - No Token Provided" 
                }
            );
        }

        // Verify the token and get user data
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        // Find the user by ID and exclude sensitive fields
        const user = await Admin.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            return res.status(403).json({ message: "Invalid Token Access" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: error?.message || "Invalid Access Token" });
    }
};
