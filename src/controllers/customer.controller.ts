import { Request, Response } from "express"
import { CustomerService } from "../services/customer.service"
import { PurchaseService } from "../services/purchase.service"
import { CarService } from "../services/car.service"
import mongoose from "mongoose"

export class CustomerController {
    static async fetchCustomer(req: Request, res: Response): Promise<any> {
        try {
            const id = req.user && req.user.id
            const customer = await CustomerService.findCustomerById(id)
            res.status(200).json({
                status: "success",
                message: "Customer fetched successfully",
                data: customer
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async fetchCustomerPurchases(req: Request, res: Response): Promise<any> {
        try {
            const id = req.user && req.user.id
            const purchases = await PurchaseService.findAllCustomerPurchases(id)
            res.status(200).json({
                status: "success",
                message: "Customer purchases fetched successfully",
                data: purchases
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async updateCustomerDetails(req: Request, res: Response): Promise<any> {
        try {
            const id = req.user && req.user.id
            const { name, email, password } = req.body
            const customer = await CustomerService.findCustomerById(id)
            if (!customer) {
                res.status(404).json({
                    status: "error",
                    message: "Customer not found"
                })
            }
            const updatedCustomer = await CustomerService.updateCustomer(id, { name, email, password })
            res.status(200).json({
                status: "success",
                message: "Customer updated successfully",
                data: updatedCustomer
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async makePurchase(req: Request, res: Response): Promise<any> {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const id = req.user && req.user.id
            const { carId, quantity } = req.body
            const findCar = await CarService.findCarById(carId)

            if (!findCar) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({
                    status: "error",
                    message: "Car not found"
                })
            }

            if (!findCar.availability || findCar.quantity < quantity) {
                await session.abortTransaction();
                session.endSession();
                return res.status(400).json({
                    status: "error",
                    message: "Car not available or insufficient quantity"
                })

            }

            //Create purchase record
            const purchase = await PurchaseService.createPurchase({
                customer: id,
                car: carId,
                price: findCar.price,
                quantity
            }, session)

            //Update quantity left
            await CarService.updateCarById(carId, { quantity: findCar.quantity - quantity }, session)

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({
                status: "success",
                message: "Purchase made successfully",
                data: purchase
            })
        } catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }
}