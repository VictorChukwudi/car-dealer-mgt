export interface ICustomer {
    name: string;
    email: string;
    password: string;
    purchasedCars?: string[];
    hasRole?: boolean;
}