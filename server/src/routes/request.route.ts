import { Router } from 'express';
import { RequestController } from '@/controllers/request.controller';
import { asyncHandler } from '@/helpers/async-handler';

const router = Router();
const requestController = new RequestController();

router.get('/requests', requestController.getAllRequests);
router.post('/approve/:id', requestController.approveRequest);
router.post('/deny/:id', requestController.denyRequest);

export { router as requestRoutes };
