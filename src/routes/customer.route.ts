import express from "express"
import { CustomerController } from "../controllers/customer.controller"
import validate from "../middlewares/validation"
import { makePurchaseSchema, updateCustomerSchema } from "../helpers/validators"


const router = express.Router()

router.get("/profile", CustomerController.fetchCustomer)
router.patch("/profile", [validate({ body: updateCustomerSchema })], CustomerController.updateCustomerDetails)
router.get("/purchases", CustomerController.fetchCustomerPurchases)
router.post("/purchase-car", [validate({ body: makePurchaseSchema })], CustomerController.makePurchase)
export default router