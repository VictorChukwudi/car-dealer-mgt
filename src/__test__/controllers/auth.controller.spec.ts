
import { Request, Response } from "express";
import { AuthController } from "../../controllers/auth.controller";
import { CustomerService } from "../../services/customer.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../services/customer.service");
jest.mock("../../services/manager.service");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        res = { status: statusMock };
    });

    describe("registerCustomer", () => {
        it("should create a new customer", async () => {
            req = {
                body: { name: "Jane", email: "jane@test.com", password: "123456" }
            };

            (CustomerService.findCustomerByEmail as jest.Mock).mockResolvedValue(null);
            (CustomerService.registerCustomer as jest.Mock).mockResolvedValue(req.body);

            await AuthController.registerCustomer(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(201);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Customer created successfully",
                })
            );
        });

        it("should return error if customer exists", async () => {
            req = {
                body: { email: "existing@test.com" }
            };

            (CustomerService.findCustomerByEmail as jest.Mock).mockResolvedValue(true);

            await AuthController.registerCustomer(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Customer already exists",
                })
            );
        });
    });

    describe("loginCustomer", () => {
        it("should log in the customer and return token", async () => {
            req = {
                body: { email: "john@test.com", password: "123456" }
            };
            const customer = {
                _id: "123",
                email: "john@test.com",
                password: "hashed",
                hasRole: "customer",
                toJSON: () => ({ email: "john@test.com" })
            };

            (CustomerService.findCustomerByEmail as jest.Mock).mockResolvedValue(customer);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            (jwt.sign as jest.Mock).mockReturnValue("test.token");

            await AuthController.loginCustomer(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({ token: "test.token" })
                })
            );
        });

        it("should return error for invalid credentials", async () => {
            req = {
                body: { email: "wrong@test.com", password: "wrong" }
            };

            (CustomerService.findCustomerByEmail as jest.Mock).mockResolvedValue({
                password: "hashed"
            });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await AuthController.loginCustomer(req as Request, res as Response);

            expect(statusMock).toHaveBeenCalledWith(400);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: "Invalid credentials"
                })
            );
        });
    });
});
