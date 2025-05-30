

export interface Payload {
    id: string;
    email: string;
    role?: string;
    hasRole?: boolean;
}

declare global {
    namespace Express {
        interface Request {
            user?: Payload;
        }
    }
}
