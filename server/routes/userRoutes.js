import { Router } from "express";

import { verifyJWT, verifyStaff } from "../middlewares/auth.middleware.js";
import { assignTeacherToSubject, getActiveSemestersWithSubjects, getTeachersForSubject, isUserVerified, putVerificationRequest, userDashboard, userLogin, UserProfile, userRegister } from "../contollers/userControllers.js";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/isUserVerified" , isUserVerified)
router.get("/me" ,verifyJWT, verifyStaff, UserProfile)
router.put("/putverificationrequest" ,verifyJWT , verifyStaff, putVerificationRequest)
router.get("/dashboard", verifyJWT, verifyStaff, userDashboard);


router.get("/getActiveSemestersWithSubjects" ,verifyJWT ,verifyStaff, getActiveSemestersWithSubjects)
router.post("/mapTeacherSubject" , verifyJWT , verifyStaff , assignTeacherToSubject)
router.get("/gettechersubjectmapping" , verifyJWT , verifyStaff , getTeachersForSubject)
export default router;
