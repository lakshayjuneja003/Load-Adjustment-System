import { Router } from "express";

import { verifyJWT, verifyStaff } from "../middlewares/auth.middleware.js";
import { userDashboard, userLogin, userRegister } from "../contollers/userControllers.js";

const router = Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/dashboard", verifyJWT, verifyStaff, userDashboard);

export default router;
