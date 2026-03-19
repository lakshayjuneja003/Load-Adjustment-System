import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import SuperAdminRoutes from "./routes/superAdminRoutes.js"
const app = express()

app.use(cors({
    origin: true, 
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/api/v1/user" , userRoutes)
app.use("/api/v1/admin" , adminRoutes)
app.use("/api/v1/superadmin" , SuperAdminRoutes)

app.get("/healthCheck" , (req, res, next)=>{
    res.send("Everything is Fine !")
})
export default app