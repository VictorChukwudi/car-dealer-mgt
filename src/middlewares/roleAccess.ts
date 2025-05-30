import { Request, Response, NextFunction } from "express";

// This middleware differentiates customers from managers
// Customers have hasRole set to false, managers have it set to true

const hasRoleAccess = (req: Request, res: Response, next: NextFunction) => {
    // Ensure user is attached to the request
    if (!req.user) {
        return res.status(401).json({
            status: "error",
            message: "Unauthorized. User not authenticated.",
        });
    }

    // Check if the user has role access (is a manager)
    if (req.user.hasRole === true) {
        return next();
    } else {
        return res.status(403).json({
            status: "error",
            message: "Access denied. Managers only.",
        });
    }
};

export default hasRoleAccess;
