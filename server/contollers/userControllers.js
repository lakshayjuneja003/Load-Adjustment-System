import SemesterConfig from "../schemas/SemstersConfig.js";
import Subject from "../schemas/Subject.js";
import { User } from "../schemas/userSchema.js";
import { VerificationRequest } from "../schemas/Verificationrequests.js";

export const userRegister = async (req, res) => {
  try {
    const { email, name, password, empId, designation, invitationUrl } = req.body;

    if (!email || !name || !password || !empId || !designation || !invitationUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the admin exists with the given invitation URL
    const adminUser = await User.findOne({ invitationUrl });
    if (!adminUser) {
      return res.status(402).json({ message: "Invalid or expired invitation URL" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new user with the admin's ID as createdBy
    const newUser = new User({
      empId,
      email,
      name,
      password,
      createdBy: adminUser._id,
      role: "Staff",
      designation,
      invitationUrl,
    });

    // Save the new user to the database
    await newUser.save();

    // Create a verification request
    const verificationRequest = new VerificationRequest({
      userId: newUser._id,
      invitationUrl,
    });

    // Save the verification request to the database
    await verificationRequest.save();

    // Check if verification request was successfully created
    if (!verificationRequest) {
      return res.status(404).json({
        message: "Error while creating verification request",
      });
    }

    return res.status(201).json({ message: "Staff registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};



export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  console.log("Incoming request body:", req.body);

  try {
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(403).json({ message: "Email and password are required" });
    }

    // Retrieve the Admin user without excluding the password field
    const user = await User.findOne({ email, role: "Staff" });

    if (!user) {
      return res.status(403).json({ message: "Staff does not exist" });
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
      role: "Staff",
    });
  } catch (error) {
    console.error("Server Error:", error); // Log the actual error
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

export const isUserVerified = async (req, res, next) => {
  console.log(req.user);
  
  try {
    const { userId } = req.body;
    const userExists = await User.findOne({ _id: userId, role: "Staff" }); // Check for _id instead of userId

    if (!userExists) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!userExists.isVerified) { // Check isVerified as a boolean
      return res.status(403).json({
        message: "User is not verified yet"
      });
    }

    return res.status(200).json({ // Use 200 for successful responses
      message: "User is verified",
      user: userExists
    });
  } catch (error) {
    console.error("Error checking user verification:", error); // Log the error for debugging
    return res.status(500).json({
      message: "Server Error",
      error: error.message // Send error message for debugging
    });
  }
};

export const putVerificationRequest = async (req, res, next) => {
  try {
    // Find the staff user
    const user = await User.findOne({ _id: req.user._id, role: "Staff" });
    console.log("User : " , user);
    
    // If no staff user is found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    console.log("Step -2 " , user);
    
    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({
        message: "User already verified",
      });
    }
    console.log("Step-3");
    
    // Check if a verification request already exists for this user
    const existingRequest = await VerificationRequest.findOne({ userId: user._id });
    if (existingRequest) {
      return res.status(409).json({
        message: "Verification request already sent to the admin",
      });
    }
    console.log("Step-4");
    
    // Create a new verification request
    const newRequest = new VerificationRequest({
      userId: user._id,
      invitationUrl: user.createdBy,
    });
    console.log("Step-5");
    
    // Save the verification request
    await newRequest.save();
    console.log("Step-6");
    
    return res.status(201).json({
      message: "Request sent to admin successfully!",
      user,
    });
  } catch (error) {
    // Return a more descriptive error message
    console.error("Error in putVerificationRequest:", error);
    return res.status(500).json({
      message: "An error occurred while processing the request",
      error: error.message || "Unknown Error",
    });
  }
};


export const getActiveSemestersWithSubjects = async (req, res) => {
  try {
    // Fetch the current semester configuration set by the admin who created the staff user
    const semesterConfig = await SemesterConfig.findOne({ adminId: req.user.createdBy });

    if (!semesterConfig) {
      return res.status(404).json({
        message: 'Semester configuration not found. Please contact the admin to set up semesters.',
      });
    }

    // Check if there are any active semesters configured
    if (semesterConfig.activeSemesters.length === 0) {
      return res.status(404).json({
        message: 'No active semesters found. Please contact the admin to activate semesters.',
      });
    }

    // Destructure active semesters from the configuration
    const { activeSemesters } = semesterConfig;

    // Fetch subjects that belong to the active semesters
    const subjects = await Subject.find({
      semester: { $in: activeSemesters },
    }).lean();

    // Organize subjects under their respective semesters and track missing subjects
    const semesterSubjects = activeSemesters.map((semester) => {
      const subjectsForSemester = subjects.filter((subject) => subject.semester === semester);
      return {
        semester,
        hasSubjects: subjectsForSemester.length > 0, // Flag to indicate if subjects are available
        subjects: subjectsForSemester,
      };
    });

    return res.status(200).json({
      message: 'Active semesters and subjects fetched successfully.',
      data: semesterSubjects,
    });
  } catch (error) {
    console.error('Error fetching active semesters with subjects:', error);
    return res.status(500).json({
      message: 'An error occurred while retrieving semesters and subjects.',
      error: error.message,
    });
  }
};

