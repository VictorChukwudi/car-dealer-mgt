import express from "express"
import { AuthController } from "../controllers/auth.controller"
import validate from "../middlewares/validation"
import { loginSchema, registerSchema } from "../helpers/validators"

const router = express.Router()


router.post("/register/customer", [validate({ body: registerSchema })], AuthController.registerCustomer)
router.post("/login/customer", [validate({ body: loginSchema })], AuthController.loginCustomer)
router.post("/register/manager", [validate({ body: registerSchema })], AuthController.registerManager)
router.post("/login/manager", [validate({ body: loginSchema })], AuthController.loginManager)

export default router