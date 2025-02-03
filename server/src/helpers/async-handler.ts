/**
 * operate like async/await
 * any error will next to error-handler function
 */
import { Request, Response, NextFunction } from 'express';

// Wrapper function giúp loại bỏ try-catch
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next); // Nếu lỗi xảy ra, gọi `next(error)`
    };
};
