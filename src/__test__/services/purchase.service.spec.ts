import mongoose from "mongoose";
import Purchase from "../../models/purchase.model";
import { PurchaseService } from "../../services/purchase.service";

jest.mock("../../models/purchase.model");

describe("PurchaseService", () => {
    const mockPurchase = {
        _id: new mongoose.Types.ObjectId("683abf2e2664979fd2c77dec"),
        customer: new mongoose.Types.ObjectId("683abf2e2664979fd2c77caa"),
        car: {
            _id: new mongoose.Types.ObjectId("683abf2e2664979fd2c77ddb"),
            brand: "Toyota",
            model: "Corolla"
        },
        price: 25000,
        quantity: 2,
        populate: jest.fn().mockResolvedValue(this)
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create a new purchase", async () => {
        (Purchase.prototype.save as jest.Mock).mockResolvedValue({
            ...mockPurchase,
            populate: jest.fn().mockResolvedValue(mockPurchase)
        });

        const result = await PurchaseService.createPurchase({
            customer: mockPurchase.customer,
            car: mockPurchase.car._id,
            price: mockPurchase.price,
            quantity: mockPurchase.quantity
        });

        expect(Purchase.prototype.save).toHaveBeenCalledWith({ session: undefined });
        expect(result).toEqual(mockPurchase);
    });

    it("should find a purchase by ID", async () => {
        (Purchase.findById as jest.Mock).mockResolvedValue(mockPurchase);

        const result = await PurchaseService.findPurchaseById(mockPurchase._id.toString());

        expect(Purchase.findById).toHaveBeenCalledWith(mockPurchase._id.toString());
        expect(result).toEqual(mockPurchase);
    });

    it("should find all purchases", async () => {
        const mockPopulate2 = jest.fn().mockResolvedValue([mockPurchase]);
        const mockPopulate1 = jest.fn().mockReturnValue({ populate: mockPopulate2 });

        (Purchase.find as jest.Mock).mockReturnValue({ populate: mockPopulate1 });

        const result = await PurchaseService.findAllPurchases();

        expect(Purchase.find).toHaveBeenCalled();
        expect(mockPopulate1).toHaveBeenCalledWith("customer");
        expect(mockPopulate2).toHaveBeenCalledWith("car");
        expect(result).toEqual([mockPurchase]);
    });

    it("should find all purchases by customer", async () => {
        (Purchase.find as jest.Mock).mockReturnValue({
            populate: jest.fn().mockResolvedValue([mockPurchase])
        });

        const result = await PurchaseService.findAllCustomerPurchases(mockPurchase.customer.toString());

        expect(Purchase.find).toHaveBeenCalledWith({ customer: mockPurchase.customer.toString() });
        expect(result).toEqual([mockPurchase]);
    });
});
