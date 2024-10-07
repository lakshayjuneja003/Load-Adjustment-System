import { User } from "../schemas/userSchema.js";

export const userRegister = async (req, res) => {
  try {
    const { email, fullname, password, username } = req.body;

    if (!email || !fullname || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({ username, email, fullname, password, role: "Staff" });
    await newUser.save();

    return res.status(201).json({ message: "Staff registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(403).json({ message: "Email and password required" });

    const user = await User.findOne({ email, role: "Staff" });
    if (!user) return res.status(403).json({ message: "Staff does not exist" });

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) return res.status(403).json({ message: "Invalid Credentials" });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.status(200).json({ message: "Login successful", token: accessToken, user, role: "Staff" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const UserProfile = async (req, res) => {
  try {
    // Getting the user ID from the request object
    const userId = req.user._id; // Using _id if using Mongoose ID convention
    const userProfile = await User.findById(userId).select('-password -refreshToken'); // Use findById with the correct user ID

    if (!userProfile) {
      return res.status(404).json({
        message: "No user found",
      });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user: userProfile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching profile",
      error: error.message, // Return the error message for better debugging
    });
  }
};
export const userDashboard = (req, res) => {
  return res.status(200).json({ message: "Welcome to the staff dashboard" });
};
