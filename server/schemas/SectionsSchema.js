import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String, // A, B, C
    required: true,
    trim: true
  },

  semester: {
    type: Number,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  department: {
    type: String, // keeping consistent with your Subject schema
    required: true
  },

  courseName: {
    type: String, // matches Department.courses
    required: true
  },

  totalStudents: {
    type: Number,
    default: 0 // optional for now, not used in scheduling yet
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // same pattern as Subject
    required: true
  }

}, { timestamps: true });

export const Section = mongoose.model("Section", sectionSchema);