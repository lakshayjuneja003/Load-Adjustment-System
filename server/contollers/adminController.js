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
    const newUser = new User({ username, email, fullname, password, role: "Admin" });
    await newUser.save();

    return res.status(201).json({ message: "Admin registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(403).json({ message: "Email and password required" });

    const user = await User.findOne({ email, role: "Admin" });
    if (!user) return res.status(403).json({ message: "Admin does not exist" });

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) return res.status(403).json({ message: "Invalid Credentials" });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie(
        "refreshToken", 
        refreshToken, 
        { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 }
    );
    return res.status(200).json({ message: "Login successful", token: accessToken, user, role: "Admin" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
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
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, adminId: req.adminId }, // Ensure the admin can only update their subjects
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
      { _id: req.params.id, adminId: req.adminId } // Ensure the admin can only delete their subjects
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or not authorized' });
    }

    res.status(200).json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subject', error: error.message });
  }
};

