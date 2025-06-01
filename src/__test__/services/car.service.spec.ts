import mongoose, { Types } from "mongoose";
import { CarService } from "../../services/car.service";
import Car from "../../models/car.model";

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
        const saveMock = jest.fn().mockResolvedValueOnce(mockCar);
        (Car as any).mockImplementation(() => ({
            save: saveMock,
        }));

        const result = await CarService.createCar(mockCar as any);
        expect(result).toEqual(mockCar);
    });

    it("should find a car by ID", async () => {
        (Car.findById as jest.Mock).mockResolvedValueOnce(mockCar);
        const result = await CarService.findCarById(mockCar._id);
        expect(Car.findById).toHaveBeenCalledWith(mockCar._id);
        expect(result).toEqual(mockCar);
    });

    it("should update a car by ID", async () => {
        const updated = { ...mockCar, price: 12000 };

        (Car.findByIdAndUpdate as jest.Mock).mockReturnValueOnce({
            populate: jest.fn().mockResolvedValueOnce(updated),
        });

        const result = await CarService.updateCarById(mockCar._id, { price: 12000 });
        expect(Car.findByIdAndUpdate).toHaveBeenCalledWith(
            mockCar._id,
            { price: 12000 },
            { new: true, session: undefined }
        );
        expect(result).toEqual(updated);
    });

    it("should delete a car by ID", async () => {
        (Car.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockCar);
        const result = await CarService.deleteCar(mockCar._id);
        expect(Car.findByIdAndDelete).toHaveBeenCalledWith(mockCar._id);
        expect(result).toEqual(mockCar);
    });

    it("should delete cars by category", async () => {
        const deleteResult = { deletedCount: 3 };
        (Car.deleteMany as jest.Mock).mockResolvedValueOnce(deleteResult);

        const result = await CarService.deleteCarsByCategory(mockCar.category as any);
        expect(Car.deleteMany).toHaveBeenCalledWith(
            { category: mockCar.category },
            { session: undefined }
        );
        expect(result).toEqual(deleteResult);
    });

    it("should find cars by filters with pagination", async () => {
        const filters = {
            brand: "Toyota",
            carModel: "Corolla",
            category: mockCar.category.toString(),
            year: 2021,
            minPrice: 8000,
            maxPrice: 12000,
            availability: true,
            page: 1,
            limit: 2,
        };

        const mockQuery = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValueOnce([mockCar]),
        };

        (Car.find as jest.Mock).mockReturnValueOnce(mockQuery);
        (Car.countDocuments as jest.Mock).mockResolvedValueOnce(1);

        const result = await CarService.findCarsByFilters(filters);

        expect(Car.find).toHaveBeenCalledWith(expect.objectContaining({
            brand: "Toyota",
            carModel: "Corolla",
            year: 2021,
            availability: true,
            price: { $gte: 8000, $lte: 12000 },
            category: expect.any(Types.ObjectId),
        }));

        expect(mockQuery.skip).toHaveBeenCalledWith(0); // page 1, limit 2
        expect(mockQuery.limit).toHaveBeenCalledWith(2);
        expect(Car.countDocuments).toHaveBeenCalledWith(expect.any(Object));

        expect(result).toEqual({
            cars: [mockCar],
            total: 1,
            limit: 2,
            page: 1,
            totalPages: 1,
        });
    });
});
