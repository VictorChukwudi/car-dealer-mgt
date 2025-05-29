import express from "express"
import authRoutes from "./auth.route"
import { authenticate } from "../middlewares/authentication"
const router = express.Router()

router.use("/auth", authRoutes)


export default router