import { Request, Response } from "express"
import { CustomerService } from "../services/customer.service"
import { compare } from "bcryptjs"
import { sign } from "jsonwebtoken"
import dotenv from "dotenv"
import { ManagerService } from "../services/manager.service"

dotenv.config()

const { JWT_SECRET } = process.env

export class AuthController {

    static async registerCustomer(req: Request, res: Response): Promise<any> {
        try {
            const { name, email, password } = req.body
            const customer = await CustomerService.findCustomerByEmail(email)
            if (customer) {
                return res.status(400).json({
                    status: "error",
                    message: "Customer email already exists"
                })
            }

            const newCustomer = await CustomerService.registerCustomer({ name, email, password })
            res.status(201).json({
                status: "success",
                message: "Customer created successfully",
                data: newCustomer
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }
    static async loginCustomer(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body
            const customer = await CustomerService.findCustomerByEmail(email)
            if (!customer) {
                return res.status(404).json({
                    status: "error",
                    message: "Customer not found"
                })
            }

            const isValidPassword = await compare(password, customer.password)
            if (!isValidPassword) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid credentials"
                })
            }

            const payload = {
                id: customer._id,
                email: customer.email,
                hasRole: customer.hasRole
            }
            const token = sign(payload, JWT_SECRET!, { expiresIn: "1d" })

            res.status(200).json({
                status: "success",
                message: "Login successful",
                data: {
                    customer: customer.toJSON(),
                    token
                }
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }
    static async registerManager(req: Request, res: Response): Promise<any> {
        try {
            const { name, email, password } = req.body
            const manager = await ManagerService.findManagerByEmail(email)
            if (manager) {
                return res.status(400).json({
                    status: "error",
                    message: "Manager email already exists"
                })
            }

            const newManager = await ManagerService.registerManager({ name, email, password })
            res.status(201).json({
                status: "success",
                message: "Manager created successfully",
                data: newManager
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }
    static async loginManager(req: Request, res: Response): Promise<any> {
        try {
            const { email, password } = req.body
            const manager = await ManagerService.findManagerByEmail(email)
            if (!manager) {
                return res.status(404).json({
                    status: "error",
                    message: "Manager not found"
                })
            }

            const isValidPassword = await compare(password, manager.password)
            if (!isValidPassword) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid credentials"
                })
            }

            const payload = {
                id: manager._id,
                email: manager.email,
                role: manager.role,
                hasRole: manager.hasRole
            }
            const token = sign(payload, JWT_SECRET!, { expiresIn: "1d" })

            res.status(200).json({
                status: "success",
                message: "Login successful",
                data: {
                    manager: manager.toJSON(),
                    token
                }
            })
        } catch (error: any) {
            res.status(500).json({
                status: "error",
                message: error.message
            })
        }
    }
}