import Handlebars from 'handlebars'
import { HttpException } from '@/shared/exceptions/http.exception'
import { MailOptions } from '@/types/mail.type'
import fs from 'fs/promises'
import nodemailer from 'nodemailer'
import path from 'path'

export class MailService {
  private readonly transporter: nodemailer.Transporter
  private readonly templatesDir: string

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST ?? 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT ?? '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASSWORD!
      }
    })
    this.templatesDir = path.join(__dirname, '..', 'templates')
  }

  async sendMail({ to, subject, templateName, context }: MailOptions): Promise<void> {
    try {
      const templatePath = path.join(this.templatesDir, `${templateName}.hbs`)
      const template = await fs.readFile(templatePath, 'utf-8')
      const compiledTemplate = Handlebars.compile(template)
      const html = compiledTemplate(context)

      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
      })
    } catch (error) {
      console.error('Email sending failed:', error)
      throw new HttpException(`Failed to send email`, 500)
    }
  }
}
