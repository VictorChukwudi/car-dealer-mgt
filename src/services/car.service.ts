import mongoose, { Types } from "mongoose";
import Car from "../models/car.model";
import { ICar } from "../models/interfaces/car.interface";


export class CarService {
    static async createCar({ brand, carModel, year, price, category, description, quantity, availability }: ICar) {
        const newCar = await new Car({
            brand,
            carModel,
            year,
            price,
            category,
            description,
            quantity,
            availability
        }).save()

        return newCar
    }

    static async findCarById(id: any) {
        const car = await Car.findById(id)
        return car
    }
    static async updateCarById(id: any, data: Partial<ICar>, session?: mongoose.ClientSession) {
        const car = await Car.findByIdAndUpdate(id, data, { new: true, session }).populate("category");
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

    static async deleteCarsByCategory(categoryId: string | any, session?: mongoose.ClientSession) {
        const cars = await Car.deleteMany({ category: categoryId }, { session });
        return cars;
    }

    static async findCarsByFilters(filters: {
        brand?: string | any,
        carModel?: string | any,
        category?: string | any,
        year?: number | any,
        minPrice?: number | any,
        maxPrice?: number | any,
        availability?: boolean | any
        page?: number,
        limit?: number
    }) {
        const query: any = {};
        if (filters.brand) query.brand = filters.brand
        if (filters.carModel) query.carModel = filters.carModel
        if (filters.category) query.category = new Types.ObjectId(filters.category)
        if (filters.year) query.year = filters.year
        if (filters.availability !== undefined) query.availability = filters.availability

        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            query.price = {};
            if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
            if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
        }

        const page = filters.page && filters.page > 0 ? filters.page : 1;
        const limit = filters.limit && filters.limit > 0 ? filters.limit : 10;
        const skip = (page - 1) * limit;

        const [cars, total] = await Promise.all([
            Car.find(query)
                .populate('category')
                .skip(skip)
                .limit(limit).exec(),
            Car.countDocuments(query)
        ]);
        return {
            cars,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
}