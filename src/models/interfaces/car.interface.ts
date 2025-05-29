import { Types } from "mongoose";

export interface ICar {
    brand: string;
    carModel: string;
    year: number;
    price: number;
    category: any;
    description: string;
    availability?: boolean;
}
