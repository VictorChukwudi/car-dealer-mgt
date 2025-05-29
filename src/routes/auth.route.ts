import express from "express"
import { AuthController } from "../controllers/auth.controller"

const router = express.Router()


router.post("/register/customer", AuthController.registerCustomer)
router.post("/login/customer", AuthController.loginCustomer)
router.post("/register/manager", AuthController.registerManager)
router.post("/login/manager", AuthController.loginManager)

export default router