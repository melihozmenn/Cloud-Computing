import { NextFunction, Request, Response } from 'express';

// Global error handler middleware
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error("An error occurred:", err);
    res.status(500).send("Internal Server Error");
}

export default errorHandler;