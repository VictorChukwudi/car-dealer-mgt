import Joi from "joi"

export const registerSchema = Joi.object({
    name: Joi.string().trim()
        .required(),
    email: Joi.string().trim()
        .required()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().trim()
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: Joi.ref('password')
})
    .with("password", "confirmPassword")


export const loginSchema = Joi.object({
    email: Joi.string().trim()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
        .required(),
    password: Joi.string().trim()
        .required()
})
    .with("email", "password")

export const carSchema = Joi.object({
    brand: Joi.string().trim()
        .required(),
    carModel: Joi.string().trim()
        .required(),
    year: Joi.number()
        .required(),
    price: Joi.number()
        .required(),
    category: Joi.string().trim()
        .required(),
    description: Joi.string().trim()
        .required(),
    quantity: Joi.number()
        .required(),
    availability: Joi.boolean()
})

export const updateCarSchema = Joi.object({
    brand: Joi.string().trim(),
    carModel: Joi.string().trim(),
    year: Joi.number(),
    price: Joi.number(),
    category: Joi.string().trim(),
    description: Joi.string().trim(),
    quantity: Joi.number(),
    availability: Joi.boolean()
})

export const idSchema = Joi.object({
    id: Joi.string().trim()
        .required()
})

export const categorySchema = Joi.object({
    name: Joi.string().trim()
        .required(),
    description: Joi.string().trim()
        .required()
})

export const updateCategorySchema = Joi.object({
    name: Joi.string().trim(),
    description: Joi.string().trim()
})

export const updateCustomerSchema = Joi.object({
    name: Joi.string().trim(),
    email: Joi.string().trim()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } }),
})

export const makePurchaseSchema = Joi.object({
    carId: Joi.string().trim()
        .required(),
    quantity: Joi.number()
        .required()
})


export const getCarsSchema = Joi.object({
    brand: Joi.string().trim(),
    model: Joi.string().trim(),
    year: Joi.number().integer().min(2000),
    availability: Joi.boolean(),
    category: Joi.string().trim(),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(10)
})
