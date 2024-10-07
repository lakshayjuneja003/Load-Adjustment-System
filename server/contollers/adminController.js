import Subject from "../schemas/Subject.js";
import { User } from "../schemas/userSchema.js";


export const adminRegister = async (req, res) => {
  try {
    const { email, fullname, password, username } = req.body;

    // Check if all fields are provided
    if (!email || !fullname || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create new admin user
    const newUser = await User.create({
      username, email, fullname, password, role: "Admin"
    });

    // Exclude sensitive fields like password and refreshToken manually
    const { password: _, refreshToken, ...userResponse } = newUser.toObject();

    if (newUser) {
      return res.status(201).json({ message: "Admin registered successfully", user: userResponse });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log("Incoming request body:", req.body);

  try {
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(403).json({ message: "Email and password required" });
    }

    // Retrieve the user without excluding the password field
    const user = await User.findOne({ email, role: "Admin" });

    if (!user) {
      return res.status(403).json({ message: "Admin does not exist" });
    }

    // Compare entered password with the stored hashed password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    // Generate access and refresh tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in the user model
    user.refreshToken = refreshToken;
    await user.save();

    // Set the refresh token in an HTTP-only cookie
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    // Exclude sensitive fields before sending the response
    const { password: _, refreshToken: __, ...userResponse } = user.toObject();

    // Return the response
    return res.status(200).json({ message: "Login successful", token: accessToken, user: userResponse, role: "Admin" });
  } catch (error) {
    console.error("Server Error:", error); // Log the actual error
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
}

export const Profile = async (req, res) => {
  try {
    // Getting the user ID from the request object
    const userId = req.user._id; // Use _id if using Mongoose ID convention
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

export const adminDashboard = (req, res) => {
  return res.status(200).json({ message: "Welcome to the admin dashboard" });
};


export const AddSubjects = async (req, res) => {
  console.log("Incoming Request Body:", req.body); // Log request body for debugging
  
  const { years, subjects } = req.body;

  // Validation example
  if (!years || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ message: 'Invalid input: adminId, years, and subjects are required.' });
  }

  // Check each subject for required fields
  for (const subject of subjects) {
    if (!subject.year || !subject.semester || !subject.subjectName || 
        !subject.subjectCode || !subject.subjectType || 
        (subject.subjectType === 'Theory' && (!subject.numberOfClasses || !subject.numberOfTutorials)) ||
        (subject.subjectType === 'Lab' && !subject.labHours) ||
        !subject.creditPoints) {
      return res.status(400).json({ message: 'Invalid input: All subject fields are required based on the type.' });
    }

    // Add adminId to each subject
    subject.adminId = req.user._id; // Associate the subject with the admin
  }

  // If validation passes, proceed to save the subjects
  try {
    const savedSubjects = await Subject.insertMany(subjects);
    return res.status(201).json({ message: 'Subjects added successfully.', data: savedSubjects });
  } catch (error) {
    console.error('Error Saving Subjects:', error); // Log error details for debugging
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};




// Get subjects created by a specific admin
export const GetSubjects = async (req, res) => {
  try {
    // Fetch subjects based on admin ID stored in the JWT
    const subjects = await Subject.find({ adminId: req.user._id });

    if (!subjects || subjects.length === 0) {
      return res.status(404).json({
        message: 'No subjects found for this admin',
        data: [],
      });
    }

    res.status(200).json({
      message: 'Subjects retrieved successfully',
      data: subjects,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving subjects',
      error: error.message,
    });
  }
};


export const UpdateSubject = async (req, res) => {
  try {
    console.log(req.params.id , req.user.id);
    
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, adminId: req.user.id }, // Ensure the admin can only update their subjects
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or not authorized' });
    }

    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subject', error: error.message });
  }
};

export const DeleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findOneAndDelete(
      { _id: req.params.id, adminId: req.user.id } // Ensure the admin can only delete their subjects
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or not authorized' });
    }

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subject', error: error.message });
  }
};

