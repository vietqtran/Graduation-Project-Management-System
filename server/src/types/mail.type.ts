export interface MailOptions {
  to: string | string[]
  subject: string
  templateName: string
  context: Record<string, any>
}
