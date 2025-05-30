export interface IPurchase {
    customer: string | any;
    car: string | any;
    price: number;
    quantity: number;
    date?: Date;
}