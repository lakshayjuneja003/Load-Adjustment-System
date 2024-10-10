import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { AddSubjects, adminDashboard, adminLogin, adminRegister, DeleteSubject, getPendingVerifications, GetSubjects, Profile, rejectUser, SetCurrentRoutes, UpdateSubject, verifyUser } from "../contollers/adminController.js";

const router = Router();
// routes for admin user details 
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/me" , verifyJWT , verifyAdmin , Profile);
router.get("/dashboard", verifyJWT, verifyAdmin, adminDashboard);

// verifications related routes
router.get("/getPendingVerifications" ,verifyJWT , verifyAdmin,getPendingVerifications)
router.post("/verifyUser" ,verifyJWT , verifyAdmin ,verifyUser);
router.post("/rejectUser" , verifyJWT , verifyAdmin , rejectUser);

// sunjects related routes
router.post("/add-subjects" ,verifyJWT, verifyAdmin , AddSubjects)
router.get("/subjects" ,verifyJWT, verifyAdmin , GetSubjects);
router.put("/subject/update/:id" ,verifyJWT, verifyAdmin , UpdateSubject);
router.delete("/subject/delete/:id" ,verifyJWT , verifyAdmin ,  DeleteSubject);


// course related routers
router.post("/setCurrentSems" ,verifyJWT , verifyAdmin, SetCurrentRoutes);

export default router;
