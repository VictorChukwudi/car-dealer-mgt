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
}