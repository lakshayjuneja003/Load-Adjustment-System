import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    required: true,
    enum: ['Admin', 'Staff']  // Admin or Staff role
  },
  empId: {
    type: String,
    required: true,
    unique: true
  },
  designation: { // For Staff only
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor'], // You can add more as needed
    required: function () {
      return this.role === 'Staff';
    }
  },
  teachingLoad: { // Only for staff
    type: Number,
    default:0
  },
  isVerified: { // For both admin and staff
    type: Boolean,
    default: false
  },
  staffCreatedBy: { // For Staff only, admin who created them
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return this.role === 'Staff';
    }
  },
  adminCreatedBy: { // For Admins only, super admin who created them
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperAdmin',
    required: function () {
      return this.role === 'Admin';
    }
  },
  universityCode: {
    type: String,
    required: true
  },
  invitationUrl:{
    type: String,
    default:undefined
  },
  adminDept: { // For Admin only
    type: String,
    required: function () {
      return this.role === 'Admin';
    }
  },
  crossDeptAccess: { // For staff, if they have access to multiple departments
    type: [String],  // Array of department names staff can access
    required: function () {
      return this.role === 'Staff';
    },
    default: []  // Default to no cross-department access
  },
  functionalities: {
    type: [String],  // Array to store functionalities assigned after approval
    default: []      // Default to empty until approved
  },
  pendingFunctionalities: {
    type: [String], // Array to store requested functionalities
    default: [] // Default to no requested functionalities
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Set teachingLoad based on designation
userSchema.pre('save', function (next) {
  // Set teachingLoad based on designation
  if (this.role === 'Staff') {
    switch (this.designation) {
      case 'Professor':
        this.teachingLoad = 12;
        break;
      case 'Associate Professor':
        this.teachingLoad = 16;
        break;
      case 'Assistant Professor':
        this.teachingLoad = 20;
        break;
      default:
        this.teachingLoad = 0;
    }
  }
  // Generate invitation URL for admins
  if (this.role === 'Admin') {
    this.invitationUrl = `${this._id}`;
  }
  else{
    this.invitationUrl = undefined;
  }

  next();
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(9);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Password comparison method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Token generation method
userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '1d',
  });
};

export const User = mongoose.model('User', userSchema);
