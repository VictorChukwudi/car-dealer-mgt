import express, { RequestHandler } from "express"
import authRoutes from "./auth.route"
import carRoutes from "./car.route"
import categoryRoutes from "./category.route"
import customerRoutes from "./customer.route"
import { authenticate } from "../middlewares/authentication"


const router = express.Router()

const authGuard = authenticate as RequestHandler


router.use("/auth", authRoutes)
router.use("/cars", carRoutes)
router.use("/categories", categoryRoutes)
router.use("/customers", [authGuard], customerRoutes)

export default router