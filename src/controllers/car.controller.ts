import { Request, Response } from "express"
import { CarService } from "../services/car.service"
import { CategoryService } from "../services/category.service"

export class CarController {

    static async createCar(req: Request, res: Response): Promise<any> {
        try {
            const { brand, carModel, year, price, category, description, quantity, availability } = req.body
            const categoryName = category.toLowerCase()
            const findCategory = categoryName && await CategoryService.findCategoryByName(categoryName)
            if (!findCategory) {
                return res.status(400).json({
                    status: "error",
                    message: "Category not found. Create car category."
                })
            }
            const newCar = await CarService.createCar({
                brand: brand.toLowerCase(),
                carModel: carModel.toLowerCase(),
                year,
                price,
                category: findCategory._id,
                description,
                quantity,
                availability
            })
            res.status(201).json({
                status: "success",
                message: "Car created successfully",
                data: newCar
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async getCars(req: Request, res: Response) {
        try {
            const { brand, model, year, availability, category, minPrice, maxPrice } = req.query

            const categoryName = category && category.toString().toLowerCase()
            const findCategory = categoryName && await CategoryService.findCategoryByName(categoryName)

            const cars = await CarService.findCarsByFilters({
                brand: brand?.toString().toLowerCase(),
                carModel: model?.toString().toLowerCase(),
                category: findCategory ? findCategory._id : undefined,
                year,
                availability,
                minPrice,
                maxPrice
            })
            res.status(200).json({
                status: "success",
                message: "Cars fetched successfully",
                data: cars
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async getCar(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params
            const car = await CarService.findCarById(id)
            if (!car) {
                return res.status(404).json({
                    status: "error",
                    message: "Car not found"
                })
            }
            res.status(200).json({
                status: "success",
                message: "Car fetched successfully",
                data: car
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async updateCar(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params
            const { brand, carModel, year, price, category, description, quantity, availability } = req.body
            const categoryName = category && category.toLowerCase()
            const findCategory = categoryName && await CategoryService.findCategoryByName(categoryName)

            if (!findCategory) {
                return res.status(400).json({
                    status: "error",
                    message: "Category not found. Create car category for updating."
                })

            }

            const findCar = await CarService.findCarById(id)
            if (!findCar) {
                return res.status(404).json({
                    status: "error",
                    message: "Car not found"
                })
            }

            const updatedCar = await CarService.updateCarById(id, {
                brand,
                carModel,
                year,
                price,
                category: findCategory._id,
                description,
                quantity,
                availability
            })

            res.status(200).json({
                status: "success",
                message: "Car updated successfully",
                data: updatedCar
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async deleteCar(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params
            const car = await CarService.deleteCar(id)
            if (!car) {
                return res.status(404).json({
                    status: "error",
                    message: "Car not found"
                })
            }
            res.status(200).json({
                status: "success",
                message: "Car deleted successfully"
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }
}