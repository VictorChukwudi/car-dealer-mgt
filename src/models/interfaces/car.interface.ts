import { Types } from "mongoose";

export interface ICar {
    brand: string;
    carModel: string;
    year: number;
    price: number;
    category: string | any;
    description: string;
    quantity: number;
    availability?: boolean;
}
