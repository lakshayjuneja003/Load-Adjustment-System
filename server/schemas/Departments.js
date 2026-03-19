import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema({
  departmentName: {
    type: String,
    required: true,
    unique: true, // Ensure department names are unique
  },
  admins: [{ // Array of admin IDs associated with this department
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users', // Assuming 'Users' is the model for admins
  }],
  totalAdmins: {
    type: Number,
    default: 0, // Default value for total admins
  },
  courses: [
    {
      courseName: {
        type: String,
        required: true, // Course name is required
      }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SuperAdmin', // Reference to the SuperAdmin who created the department
    required: true,
  },
}, { timestamps: true });

const Department = mongoose.model('Department', DepartmentSchema);
export default Department;
