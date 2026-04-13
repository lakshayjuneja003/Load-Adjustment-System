import mongoose from "mongoose";

const teacherSubjectSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Staff
    required: true
  },

  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true
  },

  department: {
    type: String, // keep consistent with your current schemas
    required: true
  },

  priority: {
    type: Number,
    default: 1 // higer = more preferred, lower = less preferred
  }

}, { timestamps: true });

export const TeacherSubject = mongoose.model("TeacherSubject", teacherSubjectSchema);