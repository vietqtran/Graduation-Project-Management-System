import Queue, { Job } from 'bull'
import * as dotenv from 'dotenv'
import RequestModel from '../models/request.model'

dotenv.config()

export class StatusQueue {
  private readonly statusQueue: any

  constructor() {
    this.statusQueue = new Queue('statusQueue', {
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
        password: process.env.REDIS_PASSWORD
      }
    })

    this.statusQueue.process(async (job: Job<{ requestId: string }>) => {
      try {
        const { requestId } = job.data
        console.log(`Processing status update for request ${requestId}`)

        const request = await RequestModel.findById(requestId)
        if (!request) {
          console.error(`Request ${requestId} not found`)
          return
        }

        if (request.status !== 'submitted') {
          await RequestModel.findByIdAndUpdate(requestId, {
            status: 'overdue',
            updated_at: new Date()
          })
          console.log(`✅ Request ${requestId} updated to overdue`)
        } else {
          console.log(`ℹ️ Request ${requestId} is already submitted, no update needed`)
        }
      } catch (error: unknown) {
        const err = error as Error
        if (job.attemptsMade < 3) throw err
        console.error(`❌ Job ${job.id} failed after 3 attempts: ${err.message}`)
      }
    })

    this.statusQueue.on('failed', (job: Job, err: Error) => {
      console.error(`❌ Job ${job.id} failed: ${err.message}`)
    })

    this.statusQueue.on('error', (err: Error) => {
      console.error(`⚠️ Queue error: ${err.message}`)
    })
  }

  async addStatusJob(requestId: string, dueDate: Date): Promise<Job | undefined> {
    console.log(`📌 Scheduling status update for request ${requestId} at ${dueDate}`)

    const delay = new Date(dueDate).getTime() - Date.now()

    if (delay <= 0) {
      console.log(`⚠️ Request ${requestId} is already overdue, updating immediately`)
      await RequestModel.findByIdAndUpdate(requestId, {
        status: 'overdue',
        updated_at: new Date()
      })
      return undefined
    }

    return this.statusQueue.add(
      { requestId },
      {
        delay,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      }
    )
  }
}
