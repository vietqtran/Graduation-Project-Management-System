import * as dotenv from 'dotenv'

import { FileInfo, PresignedUrlResponse } from '@/types/upload.type';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { HttpException } from '@/shared/exceptions/http.exception';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config()

export class S3Service {
    private readonly s3Client: S3Client;
    private readonly bucket: string;

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
        this.bucket = process.env.S3_BUCKET_NAME!;
    }

    async generatePresignedUrls(
        files: { [key: string]: FileInfo },
        userLogin: string,
        expiresIn: number = 3600
    ): Promise<PresignedUrlResponse[]> {
        try {
            const presignedUrls: PresignedUrlResponse[] = [];
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

            for (const [_, fileInfo] of Object.entries(files)) {
                const key = `uploads/${userLogin}/${timestamp}/${fileInfo.originalName}`;
                const command = new PutObjectCommand({
                    Bucket: this.bucket,
                    Key: key,
                    ContentType: fileInfo.contentType,
                });

                const presignedUrl = await getSignedUrl(this.s3Client, command, {
                    expiresIn,
                });

                presignedUrls.push({
                    presignedUrl,
                    key,
                    originalName: fileInfo.originalName,
                });
            }

            return presignedUrls;
        } catch (error) {
            console.error('Error generating presigned URLs:', error);
            throw new HttpException('Failed to generate presigned URLs', 500);
        }
    }
}