import mongoose, { Schema, Document, Model, Types } from "mongoose";
import { ICar } from "./interfaces/car.interface";

// Mongoose Document interface
export interface ICarDocument extends ICar, Document { }

const carSchema: Schema<ICarDocument> = new Schema(
    {
        brand: {
            type: String,
            required: true,
        },
        carModel: {
            type: String,
            required: true,
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
        availability: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Correct generic: use ICarDocument for the model
const Car: Model<ICarDocument> = mongoose.model<ICarDocument>("Car", carSchema);

export default Car;
