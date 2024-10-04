import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema({
  year: { type: Number, required: true },
  semester: { type: Number, required: true },
  subjectName: { type: String, required: true },
  subjectCode: { type: String, required: true },
  subjectType: { type: String, required: true, enum: ['Theory', 'Lab'] },
  numberOfClasses: { type: Number, default: 0 }, // Only for Theory
  numberOfTutorials: { type: Number, default: 0 }, // Only for Theory
  labHours: { type: Number, default: 0 }, // Only for Lab
  creditPoints: { type: Number, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
}, { timestamps: true });

const Subject = mongoose.model('Subject', subjectSchema);
export default Subject;
