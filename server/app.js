import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import adminRoutes from "./routes/adminRoutes.js"
const app = express()

app.use(cors({
    origin: true, 
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/admin" , adminRoutes)
// http://localhost:8000/api/v1/users/register
app.get("/healthCheck" , (req, res, next)=>{
    res.send("Everything is Fine !")
})
export default app