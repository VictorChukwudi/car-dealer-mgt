import { IManager } from "../models/interfaces/manager.interface";
import Manager from "../models/manager.model";


export class ManagerService {
    static async registerManager({ name, email, password }: IManager) {
        const newManager = new Manager({
            name,
            email,
            password
        }).save()

        return newManager
    }

    static async findManagerById(id: any) {
        const manager = await Manager.findById(id)
        return manager
    }

    static async findManagerByEmail(email: string) {
        const manager = await Manager.findOne({ email })
        return manager
    }
}
