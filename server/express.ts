import { configDotenv } from 'dotenv'
import Express from 'express'
configDotenv()
const app = Express()

app.listen(process.env.PORT ?? 8000)
