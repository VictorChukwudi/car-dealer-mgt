import { Request, Response } from "express";
import { PurchaseService } from "../services/purchase.service";
import { CustomerService } from "../services/customer.service";

export class PurchaseController {
    static async fetchAllPurchases(req: Request, res: Response) {
        try {
            const purchases = await PurchaseService.findAllPurchases()
            res.status(200).json({
                status: "success",
                message: "Purchases fetched successfully",
                data: purchases
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async fetchCustomerPurchases(req: Request, res: Response) {
        try {
            const customerId = req.params.customerId
            const findCustomer = await CustomerService.findCustomerById(customerId)

            if (!findCustomer) {
                return res.status(404).json({
                    status: "error",
                    message: "Customer not found"
                })
            }
            const purchases = await PurchaseService.findAllCustomerPurchases(customerId)
            res.status(200).json({
                status: "success",
                message: `Customer with id: ${customerId} purchases fetched successfully`,
                data: purchases
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }
}