import { compare } from "bcryptjs";
import Customer from "../models/customer.model";
import { ICustomer } from "../models/interfaces/customer.interface";


export class CustomerService {
    static async registerCustomer({ name, email, password }: ICustomer) {
        const newCustomer = new Customer({
            name,
            email,
            password
        }).save()

        return newCustomer
    }

    static async findCustomerById(id: any) {
        const customer = await Customer.findById(id)
        return customer
    }
    static async findCustomerByEmail(email: string) {
        const customer = await Customer.findOne({ email })
        return customer
    }
    static async updateCustomer(id: any, { name, email, password }: Partial<ICustomer>) {
        const customer = await Customer.findByIdAndUpdate(id, { name, email, password }, { new: true })
        return customer
    }
}