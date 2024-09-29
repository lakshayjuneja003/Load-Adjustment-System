import { Admin } from "../schemas/adminSchema.js";

const registerUser = async (req, res, next) => {
    try {
      const { email, fullname, password, username } = req.body;
      // 1. Check if all fields are provided
      if (!email || !fullname || !password || !username) {
        return res.status(400).json({
          message: "Every field is necessary",
        });
      }
  
      // 2. Check if the user already exists by email or username
      const userExists = await Admin.findOne({ $or: [{ email }, { username }] });
      if (userExists) {
        return res.status(409).json({
          message: "User already exists with this email or username",
        });
      }
  
      // 3. Create the user directly (password hashing is handled by the `pre-save` hook)
      const createdUser = await Admin.create({
        username,
        email,
        fullname,
        password,
      });
  
      if (!createdUser) {
        return res.status(500).json({
          message: "Error while creating user",
        });
      }
  
      // 4. Respond with the created user (excluding password)
      return res.status(201).json({
        message: "User created successfully",
        body: {
          _id: createdUser._id,
          username: createdUser.username,
          email: createdUser.email,
          fullname: createdUser.fullname,
          role : "Admin"
        },
      });
    } catch (error) {
      console.error("Error in registerUser:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
};

const loginUser = async (req, res) => {
      const { email, password } = req.body;
  
      try {
          if (!email || !password) {
              return res.status(403).json({
                  message: "Both email and password are required",
              });
          }
  
          const user = await Admin.findOne({ email });
          if (!user) {
              return res.status(403).json({
                  message: "User does not exist",
              });
          }
  
          const isPasswordCorrect = await user.isPasswordCorrect(password);
          if (!isPasswordCorrect) {
              return res.status(403).json({
                  message: "Invalid Credentials",
              });
          }
  
          // Generate access and refresh tokens
          const accessToken = user.generateAccessToken();
          const refreshToken = user.generateRefreshToken();
  
          // Save the refresh token in the database
          user.refreshToken = refreshToken;
          await user.save();
  
          // Send the refresh token as an HttpOnly cookie
          res.cookie("refreshToken", refreshToken, {
              httpOnly: true,
              secure: false, // Set to true in production (requires HTTPS)
              sameSite: "Strict",
              path: "/", // Set path to control where the cookie is sent
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
          });
  
          // Send the access token in the response body
          return res.status(200).json({
              message: "Login successful",
              token : accessToken, // Send the accessToken in response
              user: {
                  id: user._id,
                  email: user.email,
                  username: user.username,
                  role : "Admin"
              },
          });
      } catch (error) {
          return res.status(500).json({
              message: "Internal Server Error",
              error: error.message,
          });
      }
};

const logoutUser = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies; // Get the refresh token from cookies
  
      // 1. Check if the refresh token exists
      if (!refreshToken) {
        return res.status(400).json({
          message: "Refresh Token is required for logout",
        });
      }
  
      // 2. Find the user with the matching refresh token
      const user = await Admin.findOne({ refreshToken });
  
      if (!user) {
        return res.status(404).json({
          message: "User not found or already logged out",
        });
      }
  
      // 3. Remove the refresh token from the database or set it to null
      user.refreshToken = null;
      await user.save();
  
      // 4. Clear the refresh token cookie
      res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "None" });
  
      return res.status(200).json({
        message: "User logged out successfully",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      return res.status(500).json({
        message: "Internal Server Error",
        error: error.message,
      });
    }
};

const refreshAccessToken = async (req , res, next)=>{
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

  if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request")
  }

  try {
      const decodedToken = jwt.verify(
          incomingRefreshToken,
          process.env.REFRESH_TOKEN_SECRET
      )
  
      const user = await Admin.findById(decodedToken?._id)
  
      if (!user) {
          throw new ApiError(401, "Invalid refresh token")
      }
  
      if (incomingRefreshToken !== user?.refreshToken) {
          throw new ApiError(401, "Refresh token is expired or used")
          
      }
  
      const options = {
          httpOnly: true,
          secure: true
      }
  
      const accessToken= await user.generateAccessToken();
      const newRefreshToken = await user.generateRefreshToken();
  
      return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
       .json({
        message:"genrated succesfully",
        "accessToken" : accessToken,
        "refreshToken" : newRefreshToken
       })
  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token")
  }

}

const changeCurrentPassword = async (req , res, next)=>{
    const {oldPassword, newPassword} = req.body

    const user = await Admin.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        return res.status(403).json({
          message:"invalid password"
        })
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"))
}

const getCurrentUser = (req , res, next)=>{
  return res
  .status(200)
  .json({
    message:"user fetched succesfully",
    "user" : req.user
  })
}

const updateAccountDetails = async(req, res) => {
  const {fullName, email} = req.body

  if (!fullName || !email) {
      throw new ApiError(400, "All fields are required")
  }

  const user = await Admin.findByIdAndUpdate(
      req.user?._id,
      {
          $set: {
              fullName,
              email: email
          }
      },
      {new: true}
      
  ).select("-password")

  return res
  .status(200)
  .json({
    message: "Account details updated succesfully",
    "user" : user
  })
}

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
}



