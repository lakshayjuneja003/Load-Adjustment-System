import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const superAdminSchema = new mongoose.Schema({
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
  universityCode: {
    type: String,
    required: true,
    unique: true
  },
  departmentNames: {
    type: [String], // Array of department names this super admin oversees
    required: true
  },
  role: {
    type: String,
    default: 'SuperAdmin',
    enum: ['SuperAdmin']
  },
  permissions: {
    canInviteAdmins: {
      type: Boolean,
      default: true
    },
    canApproveDepartments: {
      type: Boolean,
      default: true
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  universityAddress: {
    type: String,
    required:true,
    trim: true
  },
  invitationUrl: {
    type: String,
    unique: true,
  },
});

// Password hashing middleware
superAdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    if(this.isNew){
      this.invitationUrl = `${this._id}`;
    }
    next();
  });
  
  // Password comparison method
superAdminSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  // Token generation method
superAdminSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1d',
    });
  };

export const SuperAdmin = mongoose.model('SuperAdmin', superAdminSchema);
