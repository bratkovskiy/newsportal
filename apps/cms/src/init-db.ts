import configPromise from './payload.config'
import { getPayload } from 'payload'

const start = async () => {
  console.log('Starting Payload initialization...')
  // This triggers DB connection and should trigger push: true
  await getPayload({ config: configPromise })
  console.log('Payload initialized. Check if tables exist.')
  process.exit(0)
}

start()
