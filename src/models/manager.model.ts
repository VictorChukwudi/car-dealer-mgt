import mongoose, { Document, Model, Schema } from "mongoose";
import { IManager } from "./interfaces/manager.interface";
import { hash } from "bcryptjs";
import { nextTick } from "process";



export interface IManagerDocument extends IManager, Document { }

export const managerSchema = new Schema<IManagerDocument>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "sales"],
        default: "sales",
        required: true,
    },
    hasRole: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }
)

managerSchema.pre<IManagerDocument>("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await hash(this.password, 10);
    }
    next();
});

managerSchema.set("toJSON", {
    transform: (_doc, ret) => {
        delete ret.password;
        return ret;
    },
});


const Manager: Model<IManagerDocument> = mongoose.model<IManagerDocument>("Manager", managerSchema)
export default Manager;


