import { configDotenv } from 'dotenv'

configDotenv()
configDotenv({ path: '/etc/secrets/.env' })
console.clear()

import './app'
import './_lab'
