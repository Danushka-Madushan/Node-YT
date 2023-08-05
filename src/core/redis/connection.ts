import { createClient } from 'redis'

/* Create Redis Client */
export const RedisClient = createClient()

RedisClient.on('error', (err) => {
    console.log('Redis Client Error', err)
})

RedisClient.on('ready', () => {
    console.log('Redis Connected!')
})

/* Connect Redis-Client */
await RedisClient.connect()
