import nodemailer from 'nodemailer'
const emailAddress = 'dont.stop.talking.about.palestine@gmail.com'
const transporter = nodemailer.createTransport({
  auth: { user: emailAddress, pass: process.env.GOOGLE_PASSWORD },
  service: 'gmail',
})

function mail(to: string, subject: string, body: string) {
  return transporter
    .sendMail({
      from: `Verification Bot <${emailAddress}>`,
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
