import mongoose from 'mongoose';

// Define the SemesterConfig schema
const PermissionsSchema = new mongoose.Schema({
  superAdminId: {type: mongoose.Schema.Types.ObjectId , ref: "SuperAdmin" ,required :true , unique : true},
  permissions: { type: [String], required: true }
}, { timestamps: true });

const Permissions = mongoose.model('permissionsSchema',PermissionsSchema );
export default Permissions;
