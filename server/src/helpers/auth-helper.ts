import { HttpException } from '@/shared/exceptions/http.exception';
import { TokenPayload } from '@/shared/interfaces/token-payload.interface';
import { Request } from 'express'; 

/**
 * Lấy user từ request và đảm bảo user hợp lệ
 */
export const getUser = (req: Request): TokenPayload => {
    if (!req.user) {
        throw new HttpException('User not authenticated', 401);
    }
    return req.user as TokenPayload;
};
