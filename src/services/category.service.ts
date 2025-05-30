import mongoose from "mongoose";
import Category from "../models/category.model";
import { ICategory } from "../models/interfaces/category.interface";


export class CategoryService {
    static async createCategory({ name, description }: ICategory) {
        const newCategory = await new Category({
            name: name.toLowerCase(),
            description
        }).save()

        return newCategory
    }
    static async findCategoryById(id: any) {
        const category = await Category.findById(id)
        return category
    }
    static async findCategoryByName(name: string) {
        const category = await Category.findOne({ name })
        return category
    }
    static async findAllCategories() {
        const categories = await Category.find()
        return categories
    }
    static async updateCategory(id: any, { name, description }: Partial<ICategory>, session?: mongoose.ClientSession) {
        const category = await Category.findByIdAndUpdate(id, { name, description }, { new: true, session })
        return category
    }
    static async deleteCategory(id: any, session?: mongoose.ClientSession) {
        const category = await Category.findByIdAndDelete(id, { session });
        return category;
    }

}