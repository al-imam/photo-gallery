import { appendFileSync } from 'fs'
import nodemailer from 'nodemailer'
const email = 'dont.stop.talking.about.palestine@gmail.com'

const transporter = nodemailer.createTransport({
  auth: { user: email, pass: process.env.GOOGLE_PASSWORD },
  service: 'gmail',
})

export default function mail(to: string, subject: string, body: string) {
  return transporter.sendMail({
    to,
    subject,
    from: `Verification Bot <${email}>`,
    html: body,
  })
}

export function sendOTPToEmail(email: string, code: string) {
  const text = 'OTP <' + email + '>: ' + code
  appendFileSync('./email.log', text + '\n')

  mail(email, 'OTP', text)
    .catch(() => {
      console.error('Error sending OTP to email:', email)
    })
    .then(() => {
      console.log('OTP sent to email:', email)
    })
}
