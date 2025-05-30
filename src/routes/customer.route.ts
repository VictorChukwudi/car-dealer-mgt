import express from "express"
import { CustomerController } from "../controllers/customer.controller"


const router = express.Router()

router.get("/profile", CustomerController.fetchCustomer)
router.patch("/profile", CustomerController.updateCustomerDetails)
router.get("/purchases", CustomerController.fetchCustomerPurchases)
router.get("/purchase-car", CustomerController.makePurchase)
export default router