import mongoose, { Document, Model, Schema } from "mongoose";
import { ICategory } from "./interfaces/category.interface";

export interface ICategoryDocument extends ICategory, Document { }

const categorySchema = new Schema<ICategoryDocument>({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
});

categorySchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.createdAt;
        delete ret.__v;
        return ret;
    },
});

const Category: Model<ICategoryDocument> = mongoose.model<ICategoryDocument>("Category", categorySchema);
export default Category;
