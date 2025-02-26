import { RequestController } from '@/controllers/request.controller';
import { asyncHandler } from '@/helpers/async-handler';
import { Router } from 'express';

const router = Router();
const requestController = new RequestController();

router.get('/requests', requestController.getAllRequests);
router.post('/approve/:id', requestController.approveRequest);
router.post('/deny/:id', requestController.denyRequest);
// router.post('/create', asyncHandler(requestController.createRequest));

export { router as requestRoutes };

