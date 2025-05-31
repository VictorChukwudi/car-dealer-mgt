import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ICar } from "./interfaces/car.interface";

export interface ICarDocument extends ICar, Document { }

const carSchema: Schema<ICarDocument> = new Schema(
    {
        brand: {
            type: String,
            required: true,
            lowercase: true,
        },
        carModel: {
            type: String,
            required: true,
            lowercase: true
        },
        year: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: Types.ObjectId,
            ref: "Category",
        },
        description: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        },
        availability: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);


//This middleware (hook) ensure that when the car quantity is zero, availability becomes false on updates
carSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate();

    //Check to ensure that the update is actually an object and not a pipeline to access the $set
    //Skips to next is it's a pipeline
    if (Array.isArray(update)) {
        return next();
    }
    const quantity = update?.$set?.quantity ?? update?.quantity;

    if (typeof quantity === "number") {
        this.setUpdate({
            ...update,
            $set: {
                ...update?.$set,
                availability: quantity > 0,
            },
        });
    }

    next();
});


const Car: Model<ICarDocument> = mongoose.model<ICarDocument>("Car", carSchema);

export default Car;
