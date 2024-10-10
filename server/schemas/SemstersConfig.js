import mongoose from 'mongoose';

// Define the SemesterConfig schema
const semesterConfigSchema = new mongoose.Schema({
  totalSemesters: { type: Number, required: true }, // Total number of semesters
  activeSemesters: { type: [Number], required: true }, // Array of active semester numbers
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true } // Reference to the Admin who set this config
}, { timestamps: true });

const SemesterConfig = mongoose.model('SemesterConfig', semesterConfigSchema);
export default SemesterConfig;
