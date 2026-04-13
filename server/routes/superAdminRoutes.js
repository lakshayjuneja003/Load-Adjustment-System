import { Router } from "express";
import { approveAdmin, getAddedDeps, getAdmins, getInvitationUrl, getPendingRequests, getPermissions, rejectAdminUser, setDepartmentDetails, setPermissionsForAdmins, SuperAdminLogin, SuperAdminProfile, SuperAdminRegister, updatePermissions } from "../contollers/SuperAdminController.js";
import { verifyJWT, verifySuperAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", SuperAdminRegister);
router.post("/login", SuperAdminLogin);
router.get("/me" ,verifyJWT , verifySuperAdmin, SuperAdminProfile);
router.get("/getPendingRequests" ,verifyJWT , verifySuperAdmin ,getPendingRequests);
router.put("/verifyAdmin" ,verifyJWT , verifySuperAdmin , approveAdmin);
router.put("/rejectAdmin" , verifyJWT , verifySuperAdmin , rejectAdminUser);
router.get("/getadmins" , verifyJWT , verifySuperAdmin , getAdmins)
router.put("/departmentsdata", verifyJWT , verifySuperAdmin , setDepartmentDetails)
router.get("/getaddeddeps" , verifyJWT , verifySuperAdmin , getAddedDeps)
router.put("/setPermissions" , verifyJWT , verifySuperAdmin , setPermissionsForAdmins)
router.get("/getPermissions" ,verifyJWT , verifySuperAdmin ,  getPermissions)
router.put("/updatePermissions" , verifyJWT , verifySuperAdmin , updatePermissions)
router.get("/getinvitationurl" , verifyJWT , verifySuperAdmin , getInvitationUrl)
export default router;
