import { configDotenv } from 'dotenv'

import './app'
import './_lab'

configDotenv()
configDotenv({ path: '/etc/secrets/.env' })
console.clear()
