import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    fullname: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      unique: true, 
      required: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ["Admin", "Staff"], 
      required: true 
    }, // Enum for user roles
    refreshToken: { 
      type: String 
    }, // Stores refresh token for logged-in sessions
  },
  { timestamps: true }
);

// Password hashing before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password during login
userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  console.log("Stored Password Hash:", this.password);
  console.log("Entered Password:", enteredPassword);

  const isValid = await bcrypt.compare(enteredPassword, this.password);
  console.log("Is Password Valid:", isValid);
  return isValid;
};


// Method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);



// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ['Admin', 'Staff'], // Separate admin and staff
//     required: true,
//   },
//   // New Field: Designation for Staff Users
//   designation: {
//     type: String,
//     enum: ['Professor', 'Associate Professor', 'Assistant Professor'],
//     required: function () {
//       return this.role === 'Staff'; // Only required for Staff users
//     },
//   },
//   // New Field: Teaching Load (Hours)
//   teachingLoad: {
//     type: Number,
//     default: 0, // Default to 0 until updated based on designation
//   },
// });

// // Middleware to set teaching load based on designation before saving
// userSchema.pre('save', function (next) {
//   if (this.role === 'Staff') {
//     switch (this.designation) {
//       case 'Professor':
//         this.teachingLoad = 12;
//         break;
//       case 'Associate Professor':
//         this.teachingLoad = 16;
//         break;
//       case 'Assistant Professor':
//         this.teachingLoad = 20;
//         break;
//       default:
//         this.teachingLoad = 0; // Default if no designation found
//     }
//   }
//   next();
// });

// module.exports = mongoose.model('User', userSchema);
