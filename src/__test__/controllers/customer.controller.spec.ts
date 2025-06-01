import { Request, Response } from "express";
import mongoose from "mongoose";
import { CustomerController } from "../../../src/controllers/customer.controller";
import { CustomerService } from "../../../src/services/customer.service";
import { PurchaseService } from "../../../src/services/purchase.service";
import { CarService } from "../../../src/services/car.service";

jest.mock("../../../src/services/customer.service");
jest.mock("../../../src/services/purchase.service");
jest.mock("../../../src/services/car.service");

const mockSession = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
};

describe("CustomerController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();
        req = {};
        res = {
            status: statusMock,
            json: jsonMock,
        };
        jest.clearAllMocks();
    });

    describe("fetchCustomer", () => {
        it("should return a customer", async () => {
            req.user = { id: "cust123", email: "john@email.com" };
            const mockCustomer = { id: "cust123", name: "John" };
            (CustomerService.findCustomerById as jest.Mock).mockResolvedValue(mockCustomer);

            await CustomerController.fetchCustomer(req as Request, res as Response);

            expect(CustomerService.findCustomerById).toHaveBeenCalledWith("cust123");
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "success",
                message: "Customer fetched successfully",
                data: mockCustomer,
            });
        });
    });

    describe("fetchCustomerPurchases", () => {
        it("should return customer purchases", async () => {
            req.user = { id: "cust123", email: "cust@email.com" };
            const mockPurchases = [{ car: "car123", quantity: 2 }];
            (PurchaseService.findAllCustomerPurchases as jest.Mock).mockResolvedValue(mockPurchases);

            await CustomerController.fetchCustomerPurchases(req as Request, res as Response);

            expect(PurchaseService.findAllCustomerPurchases).toHaveBeenCalledWith("cust123");
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "success",
                message: "Customer purchases fetched successfully",
                data: mockPurchases,
            });
        });
    });

    describe("updateCustomerDetails", () => {
        it("should return 404 if customer not found", async () => {
            req.user = { id: "cust123", email: "jane@email.com" };
            req.body = { name: "Jane" };
            (CustomerService.findCustomerById as jest.Mock).mockResolvedValue(null);

            await CustomerController.updateCustomerDetails(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "Customer not found",
            });
        });

        it("should update customer if found", async () => {
            req.user = { id: "cust123", email: "jane@mail.com" };
            req.body = { name: "Jane", email: "jane@mail.com", password: "secret" };
            (CustomerService.findCustomerById as jest.Mock).mockResolvedValue({ id: "cust123" });
            (CustomerService.updateCustomer as jest.Mock).mockResolvedValue({ name: "Jane" });

            await CustomerController.updateCustomerDetails(req as Request, res as Response);

            expect(CustomerService.updateCustomer).toHaveBeenCalledWith("cust123", req.body);
            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "success",
                message: "Customer updated successfully",
                data: { name: "Jane" },
            });
        });
    });

    describe("makePurchase", () => {
        beforeEach(() => {
            req.user = { id: "cust123", email: "cust@email.com" };
            req.body = { carId: "car123", quantity: 2 };

            (CarService.findCarById as jest.Mock).mockResolvedValue({
                _id: "car123",
                price: 10000,
                quantity: 5,
                availability: true
            });

            (PurchaseService.createPurchase as jest.Mock).mockResolvedValue({
                id: "p1",
                car: "car123",
                quantity: 2
            });

            (CarService.updateCarById as jest.Mock).mockResolvedValue({});

            jest.spyOn(mongoose, "startSession").mockResolvedValue(mockSession as any);
        });

        it("should return 404 if car not found", async () => {
            (CarService.findCarById as jest.Mock).mockResolvedValue(null);

            await CustomerController.makePurchase(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(404);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "Car not found",
            });
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it("should return 400 if car is not available", async () => {
            (CarService.findCarById as jest.Mock).mockResolvedValueOnce({
                availability: false,
                quantity: 10
            });

            await CustomerController.makePurchase(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "Car not available",
            });
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it("should return 400 if insufficient quantity", async () => {
            (CarService.findCarById as jest.Mock).mockResolvedValueOnce({
                availability: true,
                quantity: 1
            });

            await CustomerController.makePurchase(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "Insufficient quantity",
            });
            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
        });

        it("should process a valid purchase", async () => {
            await CustomerController.makePurchase(req as Request, res as Response);

            expect(PurchaseService.createPurchase).toHaveBeenCalledWith({
                customer: "cust123",
                car: "car123",
                price: 10000,
                quantity: 2,
            }, mockSession);

            expect(CarService.updateCarById).toHaveBeenCalledWith("car123", { quantity: 3 }, mockSession);
            expect(mockSession.commitTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "success",
                message: "Purchase made successfully",
                data: {
                    id: "p1",
                    car: "car123",
                    quantity: 2,
                },
            });
        });

        it("should abort transaction on error", async () => {
            (PurchaseService.createPurchase as jest.Mock).mockRejectedValue(new Error("DB Error"));

            await CustomerController.makePurchase(req as Request, res as Response);

            expect(mockSession.abortTransaction).toHaveBeenCalled();
            expect(mockSession.endSession).toHaveBeenCalled();
            expect(statusMock).toHaveBeenCalledWith(500);
            expect(jsonMock).toHaveBeenCalledWith({
                status: "error",
                message: "DB Error",
            });
        });
    });
});
