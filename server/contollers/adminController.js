import { AdminVerification } from "../schemas/AdminVerificationRequest.js";
import SemesterConfig from "../schemas/SemstersConfig.js";
import Subject from "../schemas/Subject.js";
import { SuperAdmin } from "../schemas/SuperAdmin.js";
import { User } from "../schemas/userSchema.js";
import { VerificationRequest } from "../schemas/Verificationrequests.js";
import Permissions from "../schemas/PermissionsSchema.js"
import mongoose from 'mongoose';
import { Section } from "../schemas/SectionsSchema.js";
import { Room } from "../schemas/RoomSchema.js";

export const adminRegister = async (req, res) => {
  try {
    const { email, name, password, empId, adminDept, invitedBy, pendingFunctionalities, universityCode } = req.body;
    
    // Check if all required fields are provided
    if (!email || !name || !password || !empId || !adminDept || !invitedBy || !universityCode) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    // checking if the invitaionurl given by admin is actually valid or not
    const Inviter = await SuperAdmin.findOne({invitationUrl : invitedBy})
    if(!Inviter){
      return res.status(400).json({
        message: "Enter inivition url is not valid"
      })
    }

    // Check if user with the same email or empId already exists
    const userExists = await User.findOne({email , role:"Admin" , universityCode});
    if (userExists) {
      return res.status(409).json({ message: "User with this email or empId already exists" });
    }

    // Create a new Admin user with pending status
    const newAdmin = await User.create({
      name,
      email,
      password,
      empId,
      role: "Admin",
      adminDept,
      universityCode,
      adminCreatedBy: invitedBy, // Linking to the super admin who invited
      isVerified: false, // Admin is pending until approved
      pendingFunctionalities: pendingFunctionalities || [] // Capture requested functionalities
    });
    
    
    // Notify the super admin about the pending admin registration
    const verificationreq = new AdminVerification({
      userId: newAdmin._id,
      createdBy: invitedBy,
      pendingFunctionalities : pendingFunctionalities
    });
    await verificationreq.save();

    // Exclude sensitive fields like password
    const { password: _, ...adminResponse } = newAdmin.toObject();

    return res.status(201).json({ 
      message: "Admin registration pending approval", 
      admin: adminResponse 
    });

  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const adminLogin = async (req, res) => {
  const { email, password , universityCode} = req.body;

  console.log("Incoming request body:", req.body);

  try {
    // Check if both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Retrieve the Admin user without excluding the password field
    const user = await User.findOne({ email, role: "Admin"  , universityCode});

    if (!user) {
      return res.status(403).json({ message: "Admin does not exist" });
    }

    // Compare entered password with the stored hashed password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ message: "Invalid Credentials" });
    }

    // Generate access token
    const accessToken = user.generateToken(); // Ensure you have this method in your user model

    // Set the refresh token in an HTTP-only cookie (if you're using refresh tokens)
    res.cookie("accessToken", accessToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

    // Exclude sensitive fields before sending the response
    const { password: __, ...userResponse } = user.toObject();

    // Return the response including empId and designation if needed
    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        ...userResponse,
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
    const isAdminVerified = req.user.isVerified;
    if(!isAdminVerified){
      return res.status(202).json({
        message:"Admin Is Not Verified"
      })
    }
    // Get admin's invitation URL from authenticated admin data
    const { _id } = req.user;
    console.log("adminInvitationUrl : ",req.user);
    
    // Fetch pending verification requests for the admin's invitation URL
    const pendingRequests = await VerificationRequest.find({ invitationUrl: _id })
      .populate('userId', 'name email empId isVerified'); // Populate user details

    return res.status(200).json({ pendingRequests });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const verifyUser = async (req, res) => {

  try {
    const { isVerified ,invitationUrl } = req.user;
    if(!isVerified || !invitationUrl){
      return res.status(202).json({
        message:"Admin Is Not Verified or invitation url is missing"
      })
    }
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required for verification" });
    }

    // Find the user to verify
    const userToVerify = await User.findById(userId , { staffCreatedBy: invitationUrl });
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
  try {
    const isAdminVerified = req.user.isVerified;
    if(!isAdminVerified){
      return res.status(202).json({
        message:"Admin Is Not Verified , Can't Access Dashboard"
      })
    }
    return res.status(200).json({ message: "Welcome to the admin dashboard" });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
  
};

export const AddSubjects = async (req, res) => {
  
  const isAdminVerified = req.user.isVerified;
    if(!isAdminVerified){
      return res.status(202).json({
        message:"Admin Is Not Verified"
      })
    }
  const { years, subjects } = req.body;
    console.log("Incoming request to add subjects with data:", req.body);
  // Validation example
  if (!years || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ message: 'Invalid input: years, and subjects are required.' });
  }

  // Check each subject for required fields
  for (const subject of subjects) {
    if (!subject.year || !subject.semester || !subject.subjectName || !subject.department || 
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
    console.error('Error Saving Subjects:', error); 
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

export const GetSubjects = async (req, res) => {
  console.log("req body for getting subjects: ",req.body);
  
  try {
    const isAdminVerified = req.user.isVerified;
    if(!isAdminVerified){
      return res.status(202).json({
        message:"Admin Is Not Verified"
      })
    }
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
    const { adminDept , isVerified } = req.user;
    const subjectId = req.params.id;
    const { updatedsubject } = req.body;
    if(!isVerified){
      return res.status(400).json({
        message:"Admin is not verified"
      })
    }
    if(!subjectId){
      return res.status(400).json({
        message:"Subject ID is required"
      })
    }
    if (!Array.isArray(updatedsubject) || updatedsubject.length === 0 ) {
      return res.status(400).json({ message: 'Invalid input:subject json should be correct and required.'});
    }
    if(updatedsubject.length > 1){
      return res.status(400).json({ message: 'Invalid input: Only one subject can be updated at a time.' });
    }
    const usubject = updatedsubject[0];
    if (!usubject.year || !usubject.semester || !usubject.subjectName || !usubject.department || 
        !usubject.subjectCode || !usubject.subjectType || 
        (usubject.subjectType === 'Theory' && (!usubject.numberOfClasses || !usubject.numberOfTutorials)) ||
        (usubject.subjectType === 'Lab' && !usubject.labHours) ||
        !usubject.creditPoints) {
      return res.status(400).json({ message: 'Invalid input: All subject fields are required based on the type.' });
    }

    // Add adminId to each subject
    usubject.adminId = req.user._id; // Associate the subject with the admin


    const subjectToUpdate = await Subject.findOne({_id: subjectId});
    if(!subjectToUpdate){
      return res.status(404).json({ message: 'Subject not found or not authorized' });
    }
    if(subjectToUpdate.department !== adminDept){
      return res.status(400).json({
        message:"Admin can't change other dept subjects"
      })
    }
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, department:adminDept },
      { $set: updatedsubject[0] },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or not authorized' });
    }

    return res.status(200).json({
      message: 'Subject updated successfully',
      data: subject
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subject', error: error.message });
  }
};

export const DeleteSubject = async (req, res) => {

  try {
    const {adminDept} = req.user;
    if(!adminDept){
      return res.status(404).json({ message: 'Subject not found or not authorized' });
    }
   const subjectId = req.params.id;
   if(!subjectId){
    return res.status(400).json({
      message:"Subject ID is required"
    })
   }
    const subject = await Subject.findOneAndDelete(
      { _id : subjectId, department : adminDept }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found or not authorized' });
    }

    return res.status(200).json({ message: 'Subject deleted successfully' });

  } catch (error) {
    return res.status(500).json({ message: 'Error deleting subject', error: error.message });
  }
};

export const SetCurrentSems = async (req, res) => {
  try {
    const { totalSemesters, activeSemesters } = req.body;
    const adminId = req.user._id;
    if (!totalSemesters || totalSemesters.length === 0 ||
      !activeSemesters || activeSemesters.length === 0) {
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

export const updateCurrentSems = async (req , res)=>{
  try {
    const { updatedtotalSemesters, updatedactiveSemesters } = req.body;
    const adminId = req.user._id;
    if(!adminId){
      return res.status(400).json({
        message:"Admin ID is missing"
      })
    }
    if (!updatedtotalSemesters || updatedtotalSemesters.length === 0 ||
      !updatedactiveSemesters || updatedactiveSemesters.length === 0) {
      return res.status(400).json({
        message: 'Total semesters and active semesters are required.'
      });
    }

    const isValidActiveSemesters = updatedactiveSemesters.every(
      sem => sem > 0 && sem <= updatedtotalSemesters
    );
    if (!isValidActiveSemesters) {
      return res.status(400).json({
        message: 'Active semesters must be within the range of total semesters.'
      });
    }
    let semsterConfig = await SemesterConfig.findOne({ adminId });

    if (!semsterConfig) {
      return res.status(404).json({
        message: 'Semester configuration not found for this admin.'
      });
    }
    
    semsterConfig.totalSemesters = updatedtotalSemesters;
    semsterConfig.activeSemesters = updatedactiveSemesters;
    await semsterConfig.save();
    
    return res.status(200).json({
      message: 'Semester configuration updated successfully',
      data: semsterConfig
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Some error occurred',
      errorObj: error
    });
  }
}

export const getCurrentSems = async (req, res) => {
  try {
    const adminId = req.user._id;
    if(!adminId){
      return res.status(400).json({
        message:"Admin ID is missing"
      })
    }
    const semsterConfig = await SemesterConfig.findOne({ adminId });

    if (!semsterConfig) {
      return res.status(404).json({
        message: 'Semester configuration not found for this admin.'
      });
    }

    return res.status(200).json({
      message: 'Semester configuration fetched successfully',
      data: semsterConfig
    });
  } catch (error) {
    return res.status(400).json({ 
      message: 'Some error occurred'
    })
  }
}
export const getInivitationUrl = async (req, res) =>{
  console.log("incoming body for getting url : " , req.user);
  
  try {
      const { isVerified } = req.user;
      if(!isVerified) {
        return res.status(400).json({
          message:"The admin is not verified yet ...."
        })
      }
      const {invitationUrl} = req.user;
      
      if(!invitationUrl) {
        return res.status(400).json({
          message:"Error fertching invitation url"
        })
      }
      return res.status(200).json({
        message:"Fetched succesfully",
        url : invitationUrl
      })
  } catch (error) {
    return res.status(500).json({
      message:"Internal Sever Error ....."
    })
  }
}

export const getAdminPermissions = async (req, res) => {
  console.log(
    "Incoming request for permissions with adminCreatedBy ID: getADMINSPERMISSIONS",
    req.query.adminCreatedBy
  );

  try {
    const superAdminId = req.query.adminCreatedBy;

    if (!superAdminId) {
      return res.status(400).json({
        message: "No adminCreatedBy ID provided.",
      });
    }

    // Correctly instantiate ObjectId with 'new'
    const objectId = new mongoose.Types.ObjectId(superAdminId);

    const permissions = await Permissions.findOne({ superAdminId: objectId });

    if (!permissions) {
      return res.status(404).json({
        message: "Permissions not found for the provided admin ID.",
      });
    }

    return res.status(200).json({
      message: "Permissions fetched successfully.",
      permissionsList: permissions,
    });
  } catch (error) {
    console.error("Error fetching permissions:", error.message);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const createSection = async (req, res) => {
  try {
    const {
      sectionName,
      semester,
      year,
      department,
      courseName,
      totalStudents
    } = req.body;

    const adminId = req.user._id; // from auth middleware

    // Basic validation
    if (!sectionName || !semester || !year || !department || !courseName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Prevent duplicate section
    const existing = await Section.findOne({
      sectionName,
      semester,
      department
    });

    if (existing) {
      return res.status(400).json({
        message: "Section already exists for this semester & department"
      });
    }

    const section = await Section.create({
      sectionName,
      semester,
      year,
      department,
      courseName,
      totalStudents,
      adminId
    });

    res.status(201).json({
      message: "Section created successfully",
      data: section
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getSections = async (req, res) => {
  try {
    const { department, semester } = req.query;

    const filter = {};

    if (department) filter.department = department;
    if (semester) filter.semester = Number(semester);

    const sections = await Section.find(filter);

    res.status(200).json({
      message: "Sections fetched successfully",
      data: sections
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteSection = async (req, res) => {
  try {
    const id = req.params.id;

    const section = await Section.findByIdAndDelete(id);

    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.status(200).json({
      message: "Section deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, department, capacity } = req.body;
    const adminId = req.user.id;

    if (!roomNumber || !roomType || !department) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await Room.findOne({ roomNumber, department });

    if (existing) {
      return res.status(400).json({
        message: "Room already exists in this department"
      });
    }

    const room = await Room.create({
      roomName: roomNumber,
      roomType,
      department,
      capacity: capacity ? capacity : 0,
      adminId
    });

    res.status(201).json({
      message: "Room created",
      data: room
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const { department, type } = req.query;

    const filter = {};

    if (department) filter.department = department;
    if (type) filter.roomType = type;

    const rooms = await Room.find(filter);

    res.status(200).json({
      message: "Rooms fetched",
      data: rooms
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};