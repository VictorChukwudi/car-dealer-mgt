import mongoose from "mongoose";
import { IPurchase } from "../models/interfaces/purchase.interface";
import Purchase from "../models/purchase.model";


export class PurchaseService {
    static async createPurchase({ customer, car, price, quantity }: IPurchase, session?: mongoose.ClientSession) {
        const newPurchase = await new Purchase({
            customer,
            car,
            price,
            quantity
        }).save({ session })

        return await newPurchase.populate('car')
    }

    static async findPurchaseById(id: any) {
        const purchase = await Purchase.findById(id)
        return purchase
    }

    static async findAllPurchases() {
        const purchases = await Purchase.find().populate('customer').populate('car')
        return purchases
    }

    static async findAllCustomerPurchases(customer: string | any) {
        const purchases = await Purchase.find({ customer }).populate('car')
        return purchases
    }
}