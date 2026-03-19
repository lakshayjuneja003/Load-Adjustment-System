import { AdminVerification } from "../schemas/AdminVerificationRequest.js";
import Department from "../schemas/Departments.js";
import Permissions from "../schemas/PermissionsSchema.js";
import { SuperAdmin } from "../schemas/SuperAdmin.js";
import { User } from "../schemas/userSchema.js";

export const SuperAdminRegister = async (req ,res)=>{
    console.log(req.body.email);
    
    try {
        const { email, name, password, universityCode, departmentNames , universityAddress } = req.body;
        // checking if any details missing
        console.log("1");
        
        if(!email || !name || !password || !universityCode || departmentNames.length == 0 || !universityAddress){
            return res.status(405).json({
                message:"Invlid details Given"
            })
        }
        console.log("2");
        const userExists = await SuperAdmin.findOne({email , universityCode});
        if(userExists){
            return res.status(400).json({
                message :"User already exists"
            })
        }
        console.log("3");
        const superadmin = await SuperAdmin.create({
            email,
            password , 
            name , 
            universityAddress, 
            universityCode , departmentNames
        })
        console.log("4")
        return res.json({
            message:"SuperAdmin Registered Succesfully",
            SuperAdmin:superadmin
        })
    } catch (error) {
        return res.status(400).json({
            message:"Some Error Occured",
            ErrorObj: error
        })
    }
}

export const SuperAdminLogin = async (req, res, next) => {
    try {
      const { email, password, universityCode } = req.body;
  
      // Check if all required credentials are provided
      if (!email || !password || !universityCode) {
        return res.status(400).json({
          message: "Invalid Credentials"
        });
      }
  
      // Find admin by email and university code
      const admin = await SuperAdmin.findOne({ email, universityCode });
      if (!admin) {
        return res.status(404).json({
          message: "Admin not found"
        });
      }
  
      // Check if the password is correct
      const isPasswordCorrect = await admin.comparePassword(password); // Instance method on the found admin
      if (!isPasswordCorrect) {
        return res.status(403).json({
          message: "Invalid Credentials"
        });
      }
  
      // Generate access token (instance method)
      const accessToken = admin.generateToken();
  
      // Set cookie for access token
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week expiration
        secure: process.env.NODE_ENV === 'production', // Secure cookie in production
        sameSite: 'strict' // Protect against CSRF
      });
  
      // Remove password before sending response to frontend
      const { password: __, ...adminResponse } = admin.toObject();
  
      // Send success response
      return res.status(200).json({
        message: "Login successful",
        token: accessToken,
        user: {
          ...adminResponse
        }
      });
      
    } catch (error) {
      return res.status(500).json({
        message: "Some error occurred",
        error: error.message
      });
    }
};

export const SuperAdminProfile = async (req , res, next)=>{
    try {
      const { email , universityCode } = req.user;
      if(!email || !universityCode){
          return res.status(400).json({
            message:"Invalid creditialds"
          })
      }
      const userAdmin = await SuperAdmin.findOne({email , role:"SuperAdmin" , universityCode});
      if(!userAdmin){
        return res.status(400).json({
          message:"No user found"
        })
      }
      const { password: __, ...adminResponse } = userAdmin.toObject()
      return res.status(200).json({
        message:"User fetched succesfully",
        user: {
          ...adminResponse
        }
      })
    } catch (error) {
      return res.status(500).json({
        message:"internal server error"
      })
    }
}
  
export const getPendingRequests = async (req, res, next) =>{
  try {
      const { invitationUrl } = req.user;
      if(!invitationUrl){
        return res.status(400).json({
          message:"No invitation url provided"
        })
      }
      const pendingRequests = await AdminVerification.find({ createdBy: invitationUrl })
      .populate('userId', 'name email empId isVerified'); // Populate user details
      if(!pendingRequests){
        return res.status(400).json({
          message: "Error in fecthing requests"
        })
      }
      return res.status(200).json({
        message:"Requests fetched succesfully",
        pendingRequests
      })
  } catch (error) {
    return res.status(500).json({
      message:"internal server error"
    })
  }
}

export const approveAdmin = async (req, res, next) => {
  try {
    const { userId, assignedFunctionalities } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "No admin id provided" });
    }

    const userToVerify = await User.findById(userId);
    if (!userToVerify) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!Array.isArray(assignedFunctionalities) || assignedFunctionalities.length === 0) {
      return res.status(400).json({ message: "Assigned functionalities must be a non-empty array" });
    }

    // Update user verification and functionalities
    userToVerify.isVerified = true;
    userToVerify.functionalities = Array.from(new Set([...userToVerify.functionalities, ...assignedFunctionalities]));
    await userToVerify.save();

    // Remove the admin verification request
    await AdminVerification.deleteOne({ userId: userId }); 

    return res.status(200).json({ message: "User verified successfully", user: userToVerify });
  } catch (error) {
    console.error("Error approving admin:", error); // Log the error for debugging
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const rejectAdminUser = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user to reject
    const userToReject = await User.findById(userId);
    if (!userToReject) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the verification request for the admin user
    const deletionResult = await AdminVerification.deleteOne({ userId: userId });
    
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

export const getAdmins = async (req , res, next) =>{
  try {
    const { invitationUrl , universityCode } = req.user;
    if(!invitationUrl){
      return res.status(400).json({
        message:"Invitation url not found"
      })
    }
    const admins = await User.find({adminCreatedBy : invitationUrl ,universityCode , role: "Admin"})
    if(!admins){
      return res.status(400).json({
        message:"No admin found"
      })
    }
    return res.status(200).json({
      message: "admins fetched succesfully",
      adminList : admins
    })
  } catch (error) {
    return res.status(500).json({
      message:"Internal server error"
    })
  }
}

export const setDepartmentDetails = async (req, res) => {
  try {
    const { departmentName, courses } = req.body;

    // Ensure courses array exists and has content
    if (!courses || !Array.isArray(courses) || courses.length === 0) {
      return res.status(400).json({ message: 'Courses are required.' });
    }

    // Check if the department already exists
    const depExists = await Department.findOne({ departmentName, createdBy: req.user._id });
    if (depExists) {
      return res.status(400).json({ message: "Department already exists." });
    }

    // Find admins for the entire department
    const adminsForDepartment = await User.find({ role: 'Admin', adminDept: departmentName });

    // Collect admin IDs (always an array, even if empty)
    const adminIds = adminsForDepartment.map(admin => admin._id);

    // Validate course names
    courses.forEach(course => {
      if (!course.courseName) {
        return res.status(400).json({ message: 'Each course must have a courseName.' });
      }
    });

    // Prepare courses without adminIds since it's handled at department level
    const updatedCourses = courses.map(course => ({
      courseName: course.courseName,
      // subjects: course.subjects // Uncomment if managing subjects
    }));

    // Create the new department
    const newDepartment = new Department({
      departmentName,
      admins: adminIds,
      totalAdmins: adminIds.length,
      courses: updatedCourses,
      createdBy: req.user._id
    });

    // Save department to the database
    await newDepartment.save();

    return res.status(201).json({
      message: 'Department details saved successfully!',
      department: newDepartment
    });

  } catch (error) {
    console.error('Error setting department details:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
};

export const getAddedDeps = async (req, res) => {
  try {
    const superadminId = req.user._id;
    const addedDeps = await Department.find({ createdBy: superadminId });

    // Check if any departments were found
    if (addedDeps.length === 0) {
      return res.status(200).json({
        message: "No departments added."
      });
    }

    return res.status(200).json({
      message: "Departments fetched successfully.",
      deps: addedDeps // Changed "Deps" to "deps" for consistency in naming
    });
  } catch (error) {
    console.error('Error fetching added departments:', error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message // Include the error message for debugging
    });
  }
};

export const setPermissionsForAdmins = async (req, res) => {
  try {
      console.log("Request body:", req.body);  // Debugging

      const { permissions } = req.body;
      if (!permissions || permissions.length <= 0) {
          return res.status(400).json({
              message: "You must provide some permissions."
          });
      }

      const setpermissions = new Permissions({
        superAdminId: req.user?._id,
          permissions: permissions
      });

      await setpermissions.save();
      return res.status(200).json({
          message: "Permissions set successfully."
      });
  } catch (error) {
      return res.status(500).json({
          message: "Internal Server Error",
          error: error.message
      });
  }
};

export const getPermissions = async (req, res)=>{
  try {
    const SuperAdminid  = req.user._id;
    if(!SuperAdminid){
      return res.status(400).json({
        message:"No admin id provided"
      })
    }
    const permissions = await Permissions.findOne({superAdminId : SuperAdminid })
    if(!permissions){
      return res.status(400).json({
        message:"No permissions found"
      })
    }
    return res.status(200).json({
      message:"Permissions fetched succesfully",
      permissions : permissions
    })
  } catch (error) {
    return res.status(400).json({
      message:"Internal server error While fecthing user permissios"
    })
  }
}

export const updatePermissions = async (req, res)=>{
  try {
      
  } catch (error) {
    return res.status(500).json({
      message:"Internal Server Error ..."
    })
  }
}

export const getInvitationUrl = async (req, res) => {
  try {
    const {invitationUrl} = req.user;
    if(!invitationUrl){
      return res.status(400).json({
        message:"No invitation url found for this user"
      })
    }
    return res.status(200).json({
      message:"Invitation url fetched succesfully",
      url: invitationUrl
    })
  } catch (error) {
    return res.status(500).json({
      message:"Internal Server Error ..."
    })
  }
}