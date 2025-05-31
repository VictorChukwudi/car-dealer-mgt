import { Request, Response } from "express";
import { CarController } from "../../../src/controllers/car.controller";
import { CarService } from "../../../src/services/car.service";
import { CategoryService } from "../../../src/services/category.service";

jest.mock("../../../src/services/car.service");
jest.mock("../../../src/services/category.service");

describe("CarController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    const mockCategory = { _id: "categoryId123", name: "suv" };
    const mockCar = {
        _id: "carId123",
        brand: "toyota",
        carModel: "camry",
        year: 2020,
        price: 30000,
        category: mockCategory._id,
        description: "Sedan car",
        quantity: 5,
        availability: true
    };

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        req = {};
        res = {
            status: statusMock,
            json: jsonMock
        };
        jest.clearAllMocks();
    });

    describe("createCar", () => {
        it("should create a new car", async () => {
            req.body = { ...mockCar, category: mockCategory.name };

            (CategoryService.findCategoryByName as jest.Mock).mockResolvedValue(mockCategory);
            (CarService.createCar as jest.Mock).mockResolvedValue(mockCar);

            await CarController.createCar(req as Request, res as Response);

            expect(CategoryService.findCategoryByName).toHaveBeenCalledWith("suv");
            expect(CarService.createCar).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "success",
                message: "Car created successfully",
                data: mockCar
            });
        });

        it("should return 400 if category not found", async () => {
            req.body = { ...mockCar, category: "nonexistent" };

            (CategoryService.findCategoryByName as jest.Mock).mockResolvedValue(null);

            await CarController.createCar(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "Category not found. Create car category."
            });
        });
    });

    describe("getCars", () => {
        it("should return filtered cars", async () => {
            req.query = { brand: "toyota", category: "suv" };

            (CategoryService.findCategoryByName as jest.Mock).mockResolvedValue(mockCategory);
            (CarService.findCarsByFilters as jest.Mock).mockResolvedValue([mockCar]);

            await CarController.getCars(req as Request, res as Response);

            expect(CarService.findCarsByFilters).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "success",
                message: "Cars fetched successfully",
                data: [mockCar]
            });
        });
    });

    describe("getCar", () => {
        it("should return a car by ID", async () => {
            req.params = { id: "carId123" };
            (CarService.findCarById as jest.Mock).mockResolvedValue(mockCar);

            await CarController.getCar(req as Request, res as Response);

            expect(CarService.findCarById).toHaveBeenCalledWith("carId123");
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "success",
                message: "Car fetched successfully",
                data: mockCar
            });
        });

        it("should return 404 if car not found", async () => {
            req.params = { id: "carId123" };
            (CarService.findCarById as jest.Mock).mockResolvedValue(null);

            await CarController.getCar(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "Car not found"
            });
        });
    });

    describe("updateCar", () => {
        it("should update a car", async () => {
            req.params = { id: "carId123" };
            req.body = { ...mockCar, category: "suv" };

            (CategoryService.findCategoryByName as jest.Mock).mockResolvedValue(mockCategory);
            (CarService.findCarById as jest.Mock).mockResolvedValue(mockCar);
            (CarService.updateCarById as jest.Mock).mockResolvedValue({ ...mockCar, price: 32000 });

            await CarController.updateCar(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "success",
                message: "Car updated successfully",
                data: { ...mockCar, price: 32000 }
            });
        });

        it("should return 404 if car not found", async () => {
            req.params = { id: "carId123" };
            req.body = { ...mockCar, category: "suv" };

            (CategoryService.findCategoryByName as jest.Mock).mockResolvedValue(mockCategory);
            (CarService.findCarById as jest.Mock).mockResolvedValue(null);

            await CarController.updateCar(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "Car not found"
            });
        });

        it("should return 400 if category not found", async () => {
            req.params = { id: "carId123" };
            req.body = { ...mockCar, category: "unknown" };

            (CategoryService.findCategoryByName as jest.Mock).mockResolvedValue(null);

            await CarController.updateCar(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "Category not found. Create car category for updating."
            });
        });
    });

    describe("deleteCar", () => {
        it("should delete a car", async () => {
            req.params = { id: "carId123" };
            (CarService.deleteCar as jest.Mock).mockResolvedValue(mockCar);

            await CarController.deleteCar(req as Request, res as Response);

            expect(CarService.deleteCar).toHaveBeenCalledWith("carId123");
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "success",
                message: "Car deleted successfully"
            });
        });

        it("should return 404 if car not found", async () => {
            req.params = { id: "carId123" };
            (CarService.deleteCar as jest.Mock).mockResolvedValue(null);

            await CarController.deleteCar(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "Car not found"
            });
        });
    });
});
