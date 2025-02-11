import { Router } from 'express';
import { S3Controller } from '../controllers/s3.controller';

const router = Router();
const s3Controller = new S3Controller();

router.post('/presigned-urls', s3Controller.getPresignedUrl);

export {router as s3Routes};