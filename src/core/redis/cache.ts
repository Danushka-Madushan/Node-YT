import { RedisClient } from './connection.js'

/* Find record from redis-cache */
export const findRecord = async (key: string) => {
    const dest = await RedisClient.get(key)
    if (dest) {
        return JSON.parse(dest) as {
            video: string,
            audio: string
        }
    }
    return false
}

/* Upsert (Update if present otherwise Insert) new record */
export const upsertRecord = async (key: string | null, value: string): Promise<boolean> => {
    if (key) {
        await RedisClient.set(key, value, {
            EX: 3600,
            NX: true
        })
        return true
    }
    return false
}

/* Insert new record. if already assigned the return false */
export const insertRecord = async (key: string, value: string) => {
    if (await RedisClient.exists(key) === 1) {
        return false
    }
    
    return upsertRecord(key, value)
}
