import { ManagerService } from "../../services/manager.service";
import Manager from "../../models/manager.model";

jest.mock("../../models/manager.model");

describe("ManagerService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should register a new manager", async () => {
        const mockData = { name: "Admin", email: "admin@test.com", password: "123456" };
        (Manager as any).mockImplementation(() => ({
            save: jest.fn().mockResolvedValue({ ...mockData, _id: "manager123" })
        }));

        const result = await ManagerService.registerManager(mockData);
        expect(result).toMatchObject(mockData);
    });

    it("should find manager by email", async () => {
        const mockManager = { email: "admin@test.com" };
        (Manager.findOne as jest.Mock).mockResolvedValue(mockManager);

        const result = await ManagerService.findManagerByEmail("admin@test.com");
        expect(Manager.findOne).toHaveBeenCalledWith({ email: "admin@test.com" });
        expect(result).toBe(mockManager);
    });
});
