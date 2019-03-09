import { Request, Response, NextFunction } from "express";

export default function(req: Request, res: Response, next: NextFunction) {
    if (!process.env.TOKEN) return res.status(500).json({
        success: false,
        info: "TOKEN env var is not set."
    });

    if (!req.headers["S-Token"]) return res.status(400).json({
        success: false,
        info: "Missing 'S-Token' header."
    });

    if (req.headers["S-Token"] != process.env.TOKEN) return res.status(403).json({
        success: false,
        info: "Invalid token provided."
    });

    next();
}