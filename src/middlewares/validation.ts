import { Request, Response, NextFunction } from "express";

const validate = (schema: {
    body?: any;
    query?: any;
    params?: any;
}) => (req: Request, res: Response, next: NextFunction) => {
    const validations = [
        schema.body && { source: 'body', result: schema.body.validate(req.body) },
        schema.query && { source: 'query', result: schema.query.validate(req.query) },
        schema.params && { source: 'params', result: schema.params.validate(req.params) }
    ].filter(Boolean);

    for (const { source, result } of validations) {
        const { error, value } = result;
        if (error) {
            return res.status(400).json({
                status: "error",
                message: error.details[0].message,
            });
        }
        (req as any)[source] = value;
    }

    next();
};

export default validate;
