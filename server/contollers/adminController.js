import SemesterConfig from "../schemas/SemstersConfig.js";
import Subject from "../schemas/Subject.js";
import { User } from "../schemas/userSchema.js";
import { VerificationRequest } from "../schemas/Verificationrequests.js";

export const adminRegister = async (req, res) => {
  try {
    const { email, name, password, empId } = req.body;

    // Check if all required fields are provided
    if (!email || !name || !password || !empId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user with the same email or empId already exists
    const userExists = await User.findOne({ $or: [{ email }, { empId }] });
    if (userExists) {
      return res.status(409).json({ message: "User with this email or empId already exists" });
    }

    // Create a new Admin user
    const newUser = await User.create({
      name,
      email,
      password,
      empId,        // Including the empId for Admins
      role: "Admin",
      isVerified: true, // Admin is automatically verified
    });

    // Exclude sensitive fields like password and refreshToken manually
    const { password: _, ...userResponse } = newUser.toObject();

    // Respond with the newly created admin user details
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
      return res.status(403).json({ message: "Email and password are required" });
    }

    // Retrieve the Admin user without excluding the password field
    const user = await User.findOne({ email, role: "Admin" });

    if (!user) {
      return res.status(403).json({ message: "Admin does not exist" });
    }

    // Compare entered password with the stored hashed password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    // Generate access and refresh tokens
    const accessToken = user.generateToken();

    // Set the refresh token in an HTTP-only cookie
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    // Exclude sensitive fields before sending the response
    const { password: __, ...userResponse } = user.toObject();

    // Return the response including empId and designation if needed
    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        ...userResponse
      },
      role: "Admin",
    });
  } catch (error) {
    console.error("Server Error:", error); // Log the actual error
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getPendingVerifications = async (req, res) => {
  try {
    console.log("User incoming body req.user :" ,req.user);
    
    // Get admin's invitation URL from authenticated admin data
    const { invitationUrl } = req.user;
    console.log("adminInvitationUrl : ",invitationUrl);
    

    // Fetch pending verification requests for the admin's invitation URL
    const pendingRequests = await VerificationRequest.find({ invitationUrl: invitationUrl })
      .populate('userId', 'name email empId isVerified'); // Populate user details
      console.log(pendingRequests);
      

    return res.status(200).json({ pendingRequests });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { userId } = req.body; // You may need to pass the invitation URL to delete the correct request

    // Find the user to verify
    const userToVerify = await User.findById(userId);
    if (!userToVerify) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user verification status
    userToVerify.isVerified = true;
    await userToVerify.save();

    // Delete the verification request after the user has been verified
    await VerificationRequest.deleteOne({ userId: userId }); 
    console.log("Deleted verification request for userId:", userId);

    return res.status(200).json({ message: "User verified successfully", user: userToVerify });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user to reject
    const userToReject = await User.findById(userId);
    if (!userToReject) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the verification request for the admin user
    const deletionResult = await VerificationRequest.deleteOne({ userId: userId });
    
    // Check if any document was deleted
    if (deletionResult.deletedCount === 0) {
      return res.status(404).json({ message: "No verification request found for this user." });
    }

    return res.status(200).json({ message: "User rejected successfully", user: userToReject });
  } catch (error) {
    console.error("Error rejecting user:", error); // Log the error for debugging
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};


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


export const SetCurrentRoutes = async (req, res) => {
  try {
    const { totalSemesters, activeSemesters } = req.body;
    const adminId = req.user._id; // Assuming the user making this request is the Admin
    if (!totalSemesters || !activeSemesters) {
      return res.status(400).json({
        message: 'Total semesters and active semesters are required.'
      });
    }

    // Validate that active semesters are within the range of total semesters
    const isValidActiveSemesters = activeSemesters.every(
      sem => sem > 0 && sem <= totalSemesters
    );
    if (!isValidActiveSemesters) {
      return res.status(400).json({
        message: 'Active semesters must be within the range of total semesters.'
      });
    }

    // Check if there is an existing configuration for the admin
    let semesterConfig = await SemesterConfig.findOne({ adminId });

    if (!semesterConfig) {
      // Create a new config if none exists
      semesterConfig = new SemesterConfig({
        totalSemesters,
        activeSemesters,
        adminId
      });
    } else {
      // Update the existing config
      semesterConfig.totalSemesters = totalSemesters;
      semesterConfig.activeSemesters = activeSemesters;
    }

    // Save the configuration
    await semesterConfig.save();

    return res.status(200).json({
      message: 'Semester configuration updated successfully',
      data: semesterConfig
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Some error occurred',
      errorObj: error
    });
  }
};
