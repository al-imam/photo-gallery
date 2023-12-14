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
