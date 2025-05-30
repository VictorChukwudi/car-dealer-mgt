import express, { RequestHandler } from "express"
import { CarController } from "../controllers/car.controller"
import { authenticate } from "../middlewares/authentication"
import hasRoleAccess from "../middlewares/roleAccess"


const router = express.Router()

const authGuard = authenticate as RequestHandler
const managerGuard = hasRoleAccess as RequestHandler

router.get("/", CarController.getCars)
router.post("/", [authGuard, managerGuard], CarController.createCar)
router.get("/:id", CarController.getCar)
router.patch("/:id", [authGuard, managerGuard], CarController.updateCar)
router.delete("/:id", [authGuard, managerGuard], CarController.deleteCar)

export default router