import { Router } from 'express';
import { RequestController } from '@/controllers/request.controller';
import { asyncHandler } from '@/helpers/async-handler';

const router = Router();
const requestController = new RequestController();

router.get('/requests', requestController.getAllRequests);

export { router as requestRoutes };
