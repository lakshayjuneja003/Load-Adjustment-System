import mongoose from 'mongoose';

// Define the SemesterConfig schema
const semesterConfigSchema = new mongoose.Schema({
  totalSemesters: { 
    type: Number, 
    required: true 
  }, 
  activeSemesters: 
  { 
    type: [Number], 
    required: true

   }, 
  adminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin', 
    required: true 
  } 
}, { 
  timestamps: true 
});

const SemesterConfig = mongoose.model('SemesterConfig', semesterConfigSchema);
export default SemesterConfig;
