import mongoose from "mongoose";

const AdminVerificationRequest = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    functionalities: {
        type: [String], // Array to store requested functionalities
        default: []
    },
    pendingFunctionalities:{
        type:[String],
        default:[]
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SuperAdmin',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '14d' // Automatically remove after 14 days
    }
});
  
export const AdminVerification = mongoose.model('AdminVerificationRequest', AdminVerificationRequest);
