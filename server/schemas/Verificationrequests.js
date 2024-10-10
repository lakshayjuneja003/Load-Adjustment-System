import mongoose from "mongoose";
const verificationRequestSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    invitationUrl: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '14d' // Automatically remove after 1 day
    }
  });
  
  export const VerificationRequest = mongoose.model('VerificationRequest', verificationRequestSchema);
  