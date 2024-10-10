import jwt from "jsonwebtoken";
import { User } from "../schemas/userSchema.js";

// Middleware to verify JWT token
export const verifyJWT = async (req, res, next) => {
  try {
    // Get the token from cookies or the Authorization header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    console.log("token for authorization :  " ,token);
    
    // Check if the token is present
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // Verify the token with the access secret key
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decodedToken);
    
    // Check if the user exists in the database
    const user = await User.findById(decodedToken.id).select("-password");
    console.log(user);
    
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // Attach user details to the request object for further middleware/routes
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to verify if the user has an Admin role
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

// Middleware to verify if the user has a Staff role
export const verifyStaff = (req, res, next) => {
  if (req.user.role !== "Staff") {
    return res.status(403).json({ message: "Forbidden: Staff members only" });
  }
  next();
};
