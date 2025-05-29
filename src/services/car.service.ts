import { Types } from "mongoose";
import Car from "../models/car.model";
import { ICar } from "../models/interfaces/car.interface";


export class CarService {
    static async createCar({ brand, carModel, year, price, category, description, availability }: ICar) {
        const newCar = new Car({
            brand,
            carModel,
            year,
            price,
            category,
            description,
            availability
        }).save()

        return newCar
    }

    static async findCarById(id: any) {
        const car = await Car.findById(id)
        return car
    }
    static async findCarsByPriceRange(minPrice: number, maxPrice: number) {
        const cars = await Car.find({
            price: {
                $gte: minPrice,
                $lte: maxPrice
            }
        }).populate("category");

        return cars;
    }
    static async findCarsByCategory(categoryId: string | Types.ObjectId) {
        const cars = await Car.find({ category: categoryId }).populate("category");
        return cars;
    }

    static async deleteCar(id: any) {
        const car = await Car.findByIdAndDelete(id)
        return car
    }

    static async deleteCarsByCategory(categoryId: string | Types.ObjectId) {
        const cars = await Car.deleteMany({ category: categoryId });
        return cars;
    }
}