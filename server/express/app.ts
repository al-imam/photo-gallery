import cors from 'cors'
import express from 'express'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
// @ts-ignore
import xss from 'xss-clean'
import router from './router'

const app = express()
app.use((req, res, next) => {
  if (req.hostname === 'ps-gallery.onrender.com') {
    return res.redirect('https://api.palestinian.top')
  }
  next()
})

app.use(cors({ origin: /.*/ }))
app.use(helmet())
app.use(
  rateLimit({
    max: 1000,
    windowMs: 60 * 60 * 1000 /* 1 Hour */,
    message: {
      error: 'Too many requests, please try again later',
    },
  })
)

app.use(express.json({ limit: '8kb' }))
app.use(mongoSanitize())
app.use(xss())
app.use(router)
app.use((_, res) => {
  res.status(404).json({
    error:
      "Currently just 'POST /upload' and 'PUT /avatar' route is in service",
  })
})

const port = process.env.PORT ?? 8000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
