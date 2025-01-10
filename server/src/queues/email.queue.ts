import { MailService } from '@/services/mail.service'
import Queue, { Job } from 'bull'
import * as dotenv from 'dotenv'

dotenv.config()

export class EmailQueue {
  private emailQueue: any

  constructor(private readonly mailService: MailService) {
    this.emailQueue = new Queue('emailQueue', {
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
      }
    })
    this.emailQueue.process(async (job: Job) => {
      console.log(`Processing job ${job.id} for ${job.data.to}`)
      try {
        await this.mailService.sendMail(job.data)
      } catch (error) {
        if (job.attemptsMade < 3) throw error
      }
    })

    this.emailQueue.on('failed', (job: Job, err: any) => {
      console.error(`Job ${job.id} failed: ${err.message}`)
    })

    this.emailQueue.on('error', (job: Job, err: any) => {
      console.error(`Job ${job} failed: ${err}`)
    })
  }

  async addEmailJob(mailOptions: any) {
    console.log('Adding email job to queue:', mailOptions)
    return this.emailQueue.add(mailOptions, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000
      }
    })
  }
}
