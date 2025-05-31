// __tests__/customer.service.test.ts
import Customer from "../../models/customer.model";
import { CustomerService } from "../../services/customer.service";

jest.mock("../../models/customer.model.ts");

describe("CustomerService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should register a new customer", async () => {
        const mockData = { name: "Jane", email: "jane@test.com", password: "123456" };
        (Customer as any).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({ ...mockData, _id: "abc123" })
        }));

        const result = await CustomerService.registerCustomer(mockData);
        expect(result).toMatchObject(mockData);
    });

    it("should find a customer by email", async () => {
        const mockCustomer = { email: "john@test.com" };
        (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

        const result = await CustomerService.findCustomerByEmail("john@test.com");
        expect(Customer.findOne).toHaveBeenCalledWith({ email: "john@test.com" });
        expect(result).toBe(mockCustomer);
    });

    it("should update a customer", async () => {
        const updated = { name: "Updated" };
        (Customer.findByIdAndUpdate as jest.Mock).mockResolvedValue(updated);

        const result = await CustomerService.updateCustomer("123", updated);
        expect(result).toBe(updated);
    });
});
