import mongoose, { Model, Schema } from "mongoose";
import { IPurchase } from "./interfaces/purchase.interface";


export interface IPurchaseDocument extends IPurchase, Document { }

export const purchaseSchema = new Schema<IPurchaseDocument>({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    car: {
        type: Schema.Types.ObjectId,
        ref: "Car",
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true }
)

const Purchase: Model<IPurchaseDocument> = mongoose.model<IPurchaseDocument>("Purchase", purchaseSchema)
export default Purchase;