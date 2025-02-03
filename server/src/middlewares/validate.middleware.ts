import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from './response-handler.middleware';

export const validateDto = (DtoClass: any, source: 'body' | 'query' | 'params' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
             // 🔹 Lấy dữ liệu từ body, query hoặc params
             const data =
             source === 'body' ? req.body :
             source === 'query' ? { ...req.query } : // ✅ Copy để tránh lỗi kiểu dữ liệu
             { ...req.params }; // ✅ Copy params để tránh lỗi

            // 🔹 Chuyển đổi dữ liệu thành DTO
            const dtoInstance = plainToInstance(DtoClass, data);
            // 🔹 Thực hiện validate
            const errors = await validate(dtoInstance);
            if (errors.length > 0) {
                const errorResponse = {
                    statusCode: 400,
                    message: 'Validation failed: '+ errors.map(err => 
                        `${err.property}: ${Object.values(err.constraints || {}).join(', ')}`
                    ).join('; '),
                };

                return ResponseHandler.sendError(res, errorResponse);
                // return res.status(400).json({
                //     success: false,
                //     errors: errors.map(err => ({
                //         field: err.property,
                //         messages: Object.values(err.constraints || {}),
                //     })),
                // });
            }

            // 🔹 Gán lại dữ liệu đã validate vào request để sử dụng tiếp trong controller
            if (source === 'body') req.body = dtoInstance;
            else if (source === 'query') req.query = dtoInstance as unknown as Record<string, any>; // ✅ Ép kiểu để tránh lỗi
            else req.params = dtoInstance as unknown as Record<string, string>;

            return next(); // ✅ Luôn gọi next() nếu validation thành công
        } catch (error) {
            next(error); // ✅ Đẩy lỗi xuống errorHandler nếu có lỗi không mong muốn
        }
    };
};
