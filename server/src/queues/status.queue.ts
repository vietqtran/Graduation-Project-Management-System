import * as dotenv from 'dotenv';
import Queue, { Job } from 'bull';
import mongoose from 'mongoose';

dotenv.config();

// Mô hình Request
const requestModel = mongoose.model('Request', new mongoose.Schema({
  status: String,
  due_date: Date,
  updated_at: Date,
}));

export class StatusQueue {
  private readonly statusQueue: any;

  constructor() {
    this.statusQueue = new Queue('statusQueue', {
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
        password: process.env.REDIS_PASSWORD,
      },
    });

    this.statusQueue.process(async (job: Job) => {
      try {
        console.log(`Processing status update for request ${job.data.requestId}`);
        await requestModel.findByIdAndUpdate(job.data.requestId, {
          status: 'overdue',
          updated_at: new Date(),
        });
      } catch (error) {
        if (job.attemptsMade < 3) throw error;
      }
    });

    this.statusQueue.on('failed', (job: Job, err: any) => {
      console.error(`Job ${job.id} failed: ${err.message}`);
    });

    this.statusQueue.on('error', (job: Job, err: any) => {
      console.error(`Job ${job} failed: ${err}`);
    });
  }

  async addStatusJob(requestId: string, dueDate: Date) {
    console.log(`Scheduling status update for request ${requestId} at ${dueDate}`);

    const delay = new Date(dueDate).getTime() - Date.now();
    if (delay > 0) {
      return this.statusQueue.add(
        { requestId },
        {
          delay,
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
        }
      );
    }
    console.log(`Request ${requestId} is already overdue.`);
  }
}
