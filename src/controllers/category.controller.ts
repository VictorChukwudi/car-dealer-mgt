import { Request, Response } from "express"
import { CategoryService } from "../services/category.service"
import { CarService } from "../services/car.service"
import mongoose from "mongoose"

export class CategoryController {
    static async createCategory(req: Request, res: Response): Promise<any> {
        try {
            const { name, description } = req.body
            const categoryName = name.toString().toLowerCase()
            const category = await CategoryService.findCategoryByName(categoryName)

            if (category) {
                return res.status(400).json({
                    status: "error",
                    message: "Category already exists"
                })
            }
            const newCategory = await CategoryService.createCategory({ name, description })
            res.status(201).json({
                status: "success",
                message: "Category created successfully",
                data: newCategory
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async findCategories(req: Request, res: Response) {
        try {
            const categories = await CategoryService.findAllCategories()
            res.status(200).json({
                status: "success",
                message: "Categories fetched successfully",
                data: categories
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async updateCategory(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { name, description } = req.body
            const category = await CategoryService.findCategoryById(id)
            if (!category) {
                res.status(404).json({
                    status: "error",
                    message: "Category not found"
                })
            }
            const updatedCategory = await CategoryService.updateCategory(id, { name, description })
            res.status(200).json({
                status: "success",
                message: "Category updated successfully",
                data: updatedCategory
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }

    static async deleteCategory(req: Request, res: Response) {
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { id } = req.params
            const category = await CategoryService.findCategoryById(id)
            if (!category) {
                await session.abortTransaction();
                res.status(404).json({
                    status: "error",
                    message: "Category not found"
                })
            }
            await CarService.deleteCarsByCategory(category?._id, session)
            const deletedCategory = await CategoryService.deleteCategory(id, session)

            await session.commitTransaction();
            session.endSession();
            res.status(200).json({
                status: "success",
                message: "Category deleted successfully",
                data: deletedCategory
            })
        } catch (error: any) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }
}