import { Request, Response, NextFunction, RequestHandler } from "express";

const validate = (schema: {
    body?: any;
    query?: any;
    params?: any;
}): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const validations = [
            schema.body && { source: "body", value: req.body, schema: schema.body },
            schema.query && { source: "query", value: req.query, schema: schema.query },
            schema.params && { source: "params", value: req.params, schema: schema.params },
        ].filter(Boolean) as { source: keyof Request; value: any; schema: any }[];

        for (const { source, value, schema } of validations) {
            const { error, value: validatedValue } = schema.validate(value);
            if (error) {
                res.status(400).json({
                    status: "error",
                    message: error.details[0].message,
                });
                return;
            }

            // copies validated values into the existing object
            Object.assign((req as any)[source], validatedValue);
        }

        next();
    };
};

export default validate;
