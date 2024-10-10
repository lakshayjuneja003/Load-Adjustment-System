import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['Admin', 'Staff'],
    required: true,
  },
  empId: {
    type: String,
    required: function () {
      return this.role === 'Staff';
    },
    trim: true,
  },
  designation: {
    type: String,
    enum: ['Professor', 'Associate Professor', 'Assistant Professor'],
    required: function () {
      return this.role === 'Staff';
    },
  },
  teachingLoad: {
    type: Number,
    default: 0, // Set to 0 by default, will be updated based on designation
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return this.role === 'Staff';
    },
  },
  invitationUrl: {
    type: String,
    unique: true,
    sparse: true, // Make it optional
  },
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
  if (this.isNew && this.role === 'Admin') {
    this.invitationUrl = `${this._id}`;
  } else if (this.role === 'Staff') {
    // Ensure invitationUrl is undefined for staff
    this.invitationUrl = undefined; // This line ensures it's not set for staff users
  }

  next();
});

// Password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
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
