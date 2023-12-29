import nodemailer from 'nodemailer'
import template1 from './template-1'
import env from '../env'

const noReplyEmailAddress = 'no-reply@palestinian.top'
const supportEmailAddress = 'support@palestinian.top'

const transporter = nodemailer.createTransport({
  auth: { user: env.GOOGLE_EMAIL, pass: env.GOOGLE_PASSWORD },
  host: 'smtp.gmail.com',
  secure: true,
  port: 465,
})

async function mail(to: string, subject: string, body: string) {
  return transporter
    .sendMail({
      replyTo: supportEmailAddress,
      from: noReplyEmailAddress,
      html: body,
      subject,
      to,
    })
    .then(() => console.log(`Sent email to ${to}`))
    .catch(console.error)
}

export default {
  sendSignupToken(to: string, token: string) {
    const url = `${env.VERCEL_URL}/signup/complete?token=${token}`
    console.log(to, token)

    return mail(
      to,
      'Complete your signup',
      template1({
        welcome: 'Welcome!',
        iconUrl: 'https://img.icons8.com/clouds/100/000000/handshake.png',
        hidden: `Please click the link below to create your account: <a href="${url}">Create account</a>`,
        description:
          "We're excited to have you get started. First, you need to confirm your account. Just press the button below.",

        color: '#81C75F',
        buttonText: 'Confirm account',
        buttonLink: url,
      })
    )
  },

  sendResetToken(to: string, token: string) {
    const url = `${env.VERCEL_URL}/reset-password/complete?token=${token}`
    console.log(to, token)

    return mail(
      to,
      'Reset your password',
      template1({
        welcome: 'Reset Password!',
        iconUrl: 'https://img.icons8.com/?size=256&id=115647',
        hidden: `Please click the link below to reset your password: <a href="${url}">Reset password</a>`,
        description:
          'We heard that you lost your password. Sorry about that! Just press the button below to reset your password.',
        color: '#FFA73B',
        buttonText: 'Reset password',
        buttonLink: url,
      })
    )
  },

  sendChangeEmailToken(to: string, token: string) {
    const url = `${env.VERCEL_URL}/change-email/complete?token=${token}`
    console.log(to, token)

    return mail(
      to,
      'Change your email address',
      template1({
        welcome: 'Change Email!',
        iconUrl: 'https://img.icons8.com/?size=256&id=113805&format=png',
        hidden: `Please click the link below to change your email address: <a href="${url}">Change email address</a>`,
        description:
          'We heard that you want to change your email address. Just press the button below to change your email address.',
        color: '#F56565',
        buttonText: 'Change email',
        buttonLink: url,
      })
    )
  },

  sendPublicEmailToken(to: string, token: string) {
    const url = `${env.VERCEL_URL}/public-email/complete?token=${token}`
    console.log(to, token)

    return mail(
      to,
      'Change your email address',
      template1({
        welcome: 'Change Email!',
        iconUrl: 'https://img.icons8.com/?size=256&id=113805&format=png',
        hidden: `Please click the link below to change your email address: <a href="${url}">Change email address</a>`,
        description:
          'We heard that you want to change your email address. Just press the button below to change your email address.',
        color: '#F56565',
        buttonText: 'Change email',
        buttonLink: url,
      })
    )
  },
}
