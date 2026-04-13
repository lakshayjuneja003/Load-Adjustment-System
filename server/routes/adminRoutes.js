import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { AddSubjects, adminDashboard, adminLogin, adminRegister, createRoom, createSection, deleteSection, DeleteSubject, getAdminPermissions, getCurrentSems, getInivitationUrl, getPendingVerifications, getRooms, getSections, GetSubjects, Profile, rejectUser, SetCurrentSems, updateCurrentSems, UpdateSubject, verifyUser } from "../contollers/adminController.js";

const router = Router();
// routes for admin user details 
router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/me" , verifyJWT , verifyAdmin , Profile);
router.get("/dashboard", verifyJWT, verifyAdmin, adminDashboard);
router.get("/getinvitationurl" , verifyJWT , verifyAdmin , getInivitationUrl)

// verifications related routes
router.get("/getPendingVerifications" ,verifyJWT , verifyAdmin,getPendingVerifications)
router.post("/verifyUser" ,verifyJWT , verifyAdmin ,verifyUser);
router.post("/rejectUser" , verifyJWT , verifyAdmin , rejectUser);

// sunjects related routes
router.post("/add-subjects" ,verifyJWT, verifyAdmin , AddSubjects)
router.get("/subjects" ,verifyJWT, verifyAdmin , GetSubjects);
router.put("/subject/update/:id" ,verifyJWT, verifyAdmin , UpdateSubject);
router.delete("/subject/delete/:id" ,verifyJWT , verifyAdmin ,  DeleteSubject);
router.put("/addSections", verifyJWT , verifyAdmin ,createSection) 
router.get("/getSections", verifyJWT , verifyAdmin ,getSections)
router.delete("/deleteSection/:id", verifyJWT , verifyAdmin ,deleteSection)
// other imp routers
router.post("/setCurrentSems" ,verifyJWT , verifyAdmin, SetCurrentSems); 
router.put("/updateCurrentSems" , verifyJWT , verifyAdmin , updateCurrentSems) 
router.get("/getCurrentSems" , verifyJWT , verifyAdmin , getCurrentSems)
router.get("/getpermissions" , getAdminPermissions)
router.post("/createroom" , verifyJWT , verifyAdmin , createRoom)
router.get("/getrooms" , verifyJWT , verifyAdmin , getRooms)
export default router;
