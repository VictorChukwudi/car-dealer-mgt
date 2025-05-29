import mongoose, { Schema, Model, Document, Types } from "mongoose";
import { ICustomer } from "./interfaces/customer.interface";
import { hash } from "bcryptjs";

export interface ICustomerDocument extends ICustomer, Document { }

export const customerSchema = new Schema<ICustomerDocument>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    purchasedCars: [
        {
            type: Schema.Types.ObjectId,
            ref: "Car",
            default: [],
        },
    ],
    hasRole: {
        type: Boolean,
        default: false

    }
}, { timestamps: true });

customerSchema.pre<ICustomerDocument>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await hash(this.password, 10);
    }
    next();
});

customerSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    },
});

const Customer: Model<ICustomerDocument> = mongoose.model<ICustomerDocument>(
    "Customer",
    customerSchema
);
export default Customer;
