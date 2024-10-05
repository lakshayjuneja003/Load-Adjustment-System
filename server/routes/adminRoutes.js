import { Router } from "express";
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js";
import { AddSubjects, adminDashboard, adminLogin, adminRegister, DeleteSubject, GetSubjects, UpdateSubject } from "../contollers/adminController.js";

const router = Router();

router.post("/register", adminRegister);
router.post("/login", adminLogin);
router.get("/dashboard", verifyJWT, verifyAdmin, adminDashboard);
router.post("/add-subjects" ,verifyJWT, verifyAdmin , AddSubjects)
router.get("/subjects" ,verifyJWT, verifyAdmin , GetSubjects);
router.put("/subject/update/:id" ,verifyJWT, verifyAdmin , UpdateSubject);
router.delete("/subject/delete/:id" ,verifyJWT , verifyAdmin ,  DeleteSubject);

export default router;
