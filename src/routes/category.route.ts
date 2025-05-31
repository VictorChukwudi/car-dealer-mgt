import express, { RequestHandler } from "express"
import { CategoryController } from "../controllers/category.controller"
import { authenticate } from "../middlewares/authentication"
import hasRoleAccess from "../middlewares/roleAccess"
import validate from "../middlewares/validation"
import { categorySchema, idSchema, updateCategorySchema } from "../helpers/validators"


const router = express.Router()

const authGuard = authenticate as RequestHandler
const managerGuard = hasRoleAccess as RequestHandler

router.get("/", CategoryController.findCategories)
router.post("/", [authGuard, managerGuard, validate({ body: categorySchema })], CategoryController.createCategory)
router.patch("/:id", [authGuard, managerGuard, validate({ params: idSchema, body: updateCategorySchema })], CategoryController.updateCategory)
router.delete("/:id", [authGuard, managerGuard, validate({ params: idSchema })], CategoryController.deleteCategory)

export default router