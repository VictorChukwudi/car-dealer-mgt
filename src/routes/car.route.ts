import express, { RequestHandler } from "express"
import { CarController } from "../controllers/car.controller"
import { authenticate } from "../middlewares/authentication"
import hasRoleAccess from "../middlewares/roleAccess"
import validate from "../middlewares/validation"
import { carSchema, getCarsSchema, idSchema, updateCarSchema } from "../helpers/validators"


const router = express.Router()

const authGuard = authenticate as RequestHandler
const managerGuard = hasRoleAccess as RequestHandler

router.get("/", validate({ query: getCarsSchema }), CarController.getCars)
router.post("/", [authGuard, managerGuard, validate({ body: carSchema })], CarController.createCar)
router.get("/:id", [validate({ params: idSchema })], CarController.getCar)
router.patch("/:id", [authGuard, managerGuard, validate({ params: idSchema, body: updateCarSchema })], CarController.updateCar)
router.delete("/:id", [authGuard, managerGuard, validate({ params: idSchema })], CarController.deleteCar)

export default router