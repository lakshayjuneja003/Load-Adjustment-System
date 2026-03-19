import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomName: {
    type: String, // e.g. R101, Lab1
    required: true,
    trim: true
  },

  roomType: {
    type: String,
    enum: ["Lecture", "Lab"],
    required: true
  },

  department: {
    type: String, // keeping consistent with your schemas
    required: true
  },

  capacity: {
    type: Number,
    default: 0 // optional for MVP
  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

export const Room = mongoose.model("Room", roomSchema);