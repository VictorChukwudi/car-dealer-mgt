import express, { RequestHandler } from "express"
import { CategoryController } from "../controllers/category.controller"
import { authenticate } from "../middlewares/authentication"
import hasRoleAccess from "../middlewares/roleAccess"


const router = express.Router()

const authGuard = authenticate as RequestHandler
const managerGuard = hasRoleAccess as RequestHandler

router.get("/", CategoryController.findCategories)
router.post("/", [authGuard, managerGuard], CategoryController.createCategory)
router.patch("/:id", [authGuard, managerGuard], CategoryController.updateCategory)
router.delete("/:id", [authGuard, managerGuard], CategoryController.deleteCategory)

export default router