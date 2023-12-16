import env from './env'
import nodemailer from 'nodemailer'
const emailAddress = 'no-reply@palestinian.top'
const transporter = nodemailer.createTransport({
  auth: { user: env.GOOGLE_EMAIL, pass: env.GOOGLE_PASSWORD },
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
})

function mail(to: string, subject: string, body: string) {
  return transporter
    .sendMail({
      from: emailAddress,
      priority: 'high',
      html: body,
      subject,
      to,
    })
    .catch(console.error)
}

export default {
  sendSignupToken(to: string, token: string) {
    return mail(
      to,
      'Create your account',
      `<a href="http://localhost:3000/api/redirect/create-account?token=${token}">Click here to verify your email</a>`
    )
  },

  sendResetToken(to: string, token: string) {
    return mail(
      to,
      'Reset your password',
      `<a href="http://localhost:3000/api/redirect/reset-password?token=${token}">Click here to reset your password</a>`
    )
  },

  sendChangeEmailToken(to: string, token: string) {
    return mail(
      to,
      'Change your email',
      `<a href="http://localhost:3000/api/redirect/change-email?token=${token}">Click here to change your email</a>`
    )
  },
}
