import mongoose from "mongoose";
import Category from "../../models/category.model";
import { CategoryService } from "../../services/category.service";

jest.mock("../../models/category.model");

describe("CategoryService", () => {
    const mockCategory = {
        _id: new mongoose.Types.ObjectId("683abf2e2664979fd2c77deb"),
        name: "sedan",
        description: "Small to medium-sized cars"
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new category", async () => {
        (Category.prototype.save as jest.Mock).mockResolvedValue(mockCategory);

        const result = await CategoryService.createCategory({
            name: "Sedan",
            description: "Small to medium-sized cars"
        });

        expect(Category.prototype.save).toHaveBeenCalled();
        expect(result).toEqual(mockCategory);
    });

    it("should find a category by ID", async () => {
        (Category.findById as jest.Mock).mockResolvedValue(mockCategory);

        const result = await CategoryService.findCategoryById(mockCategory._id.toString());

        expect(Category.findById).toHaveBeenCalledWith(mockCategory._id.toString());
        expect(result).toEqual(mockCategory);
    });

    it("should find a category by name", async () => {
        (Category.findOne as jest.Mock).mockResolvedValue(mockCategory);

        const result = await CategoryService.findCategoryByName("sedan");

        expect(Category.findOne).toHaveBeenCalledWith({ name: "sedan" });
        expect(result).toEqual(mockCategory);
    });

    it("should find all categories", async () => {
        (Category.find as jest.Mock).mockResolvedValue([mockCategory]);

        const result = await CategoryService.findAllCategories();

        expect(Category.find).toHaveBeenCalled();
        expect(result).toEqual([mockCategory]);
    });

    it("should update a category", async () => {
        const updatedCategory = {
            ...mockCategory,
            description: "Updated description"
        };

        (Category.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedCategory);

        const result = await CategoryService.updateCategory(mockCategory._id.toString(), {
            name: "sedan",
            description: "Updated description"
        });

        expect(Category.findByIdAndUpdate).toHaveBeenCalledWith(
            mockCategory._id.toString(),
            {
                name: "sedan",
                description: "Updated description"
            },
            { new: true, session: undefined }
        );

        expect(result).toEqual(updatedCategory);
    });

    it("should delete a category", async () => {
        (Category.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCategory);

        const result = await CategoryService.deleteCategory(mockCategory._id.toString());

        expect(Category.findByIdAndDelete).toHaveBeenCalledWith(mockCategory._id.toString(), { session: undefined });
        expect(result).toEqual(mockCategory);
    });
});
