import mongoose from "mongoose";
import { CarService } from "../../services/car.service";
import Car from "../../models/car.model";
import { Types } from "mongoose";

jest.mock("../../models/car.model");

describe("CarService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockCar = {
        _id: new Types.ObjectId(),
        brand: "Toyota",
        carModel: "Corolla",
        year: 2021,
        price: 10000,
        category: new Types.ObjectId(),
        description: "A reliable car",
        quantity: 5,
        availability: true,
    };

    it("should create a new car", async () => {
        (Car as any).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue(mockCar),
        }));

        const result = await CarService.createCar(mockCar);
        expect(result).toEqual(mockCar);
    });

    it("should find a car by ID", async () => {
        (Car.findById as jest.Mock).mockResolvedValue(mockCar);
        const result = await CarService.findCarById(mockCar._id);
        expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
        expect(result).toEqual(mockCar);
    });

    it("should update a car by ID", async () => {
        const updated = { ...mockCar, price: 12000 };
        (Car.findByIdAndUpdate as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(updated),
        });

        const result = await CarService.updateCarById(mockCar._id, { price: 12000 });
        expect(result).toEqual(updated);
    });

    it("should delete a car by ID", async () => {
        (Car.findByIdAndDelete as jest.Mock).mockResolvedValue(mockCar);
        const result = await CarService.deleteCar(mockCar._id);
        expect(Car.findByIdAndDelete).toHaveBeenCalledWith(mockCar._id);
        expect(result).toEqual(mockCar);
    });

    it("should delete cars by category", async () => {
        const deleteResult = { deletedCount: 3 };
        (Car.deleteMany as jest.Mock).mockResolvedValue(deleteResult);

        const result = await CarService.deleteCarsByCategory(mockCar.category.toString());
        expect(Car.deleteMany).toHaveBeenCalledWith({ category: mockCar.category.toString() }, { session: undefined });
        expect(result).toEqual(deleteResult);
    });

    it("should find cars by filters", async () => {
        const cars = [mockCar];
        (Car.find as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue(cars),
        });

        const filters = {
            brand: "Toyota",
            carModel: "Corolla",
            category: mockCar.category.toString(),
            year: 2021,
            minPrice: 8000,
            maxPrice: 12000,
            availability: true,
        };

        const result = await CarService.findCarsByFilters(filters);
        expect(Car.find).toHaveBeenCalledWith(expect.objectContaining({
            brand: "Toyota",
            carModel: "Corolla",
            year: 2021,
            availability: true,
            price: { $gte: 8000, $lte: 12000 },
            category: expect.any(Types.ObjectId)
        }));
        expect(result).toEqual(cars);
    });
});
