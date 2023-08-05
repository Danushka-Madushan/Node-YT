import { Router, Request, Response } from 'express';
import { ExpressResponse } from '../core/utils/response.js';
const app = Router()

import { TQuery, TStreamSession, TStreamsArray, ytResponse } from 'youtube/fetch';
import { fetchYoutube } from '../core/scraper/yt.js';
import { generateMD5 } from '../core/utils/hash.js';
import { findRecord, insertRecord } from '../core/redis/cache.js';

const VIDRegex = /^https?:\/\/w{3}[.]youtube[.]com\/watch\?v=(?<vid>.+)$/i

app.get('/yt/fetch', async (req: Request<object, object, object, TQuery>, res: Response) => {
    const { query: { url } } = req

    if (!url || !VIDRegex.test(url)) {
        return ExpressResponse(res, false, 400, {
            message: 'INVALID_URL'
        })
    }

    const _id = VIDRegex.exec(url)

    if (!_id || !_id.groups) {
        return ExpressResponse(res, false, 400, {
            message: 'INVALID_URL'
        })
    }

    const data = await fetchYoutube(_id.groups['vid'])

    if (data && data.groups) {
        const streamSession: TStreamSession = {}

        const { streamingData, videoDetails: { title, videoId, author, thumbnail: { thumbnails } } } = JSON.parse(data.groups.ytInitialPlayerResponse) as ytResponse

        const streams: { [key: string]: Array<TStreamsArray> } = {
            videos: [],
            audios: []
        }

        for (const { url, qualityLabel, contentLength, mimeType, quality, lastModified } of streamingData.formats) {
            const mime = /^video\/(?<quality>[^;]+)/i.exec(mimeType)?.groups

            if (/^video/.test(mimeType)) {
                streams.videos.push({
                    url: url,
                    mimeType: mime ? mime['quality'] : false,
                    qualityLabel: quality,
                    size: Math.round(parseInt(contentLength) / 1024) / 1000 || false,
                    quality: qualityLabel,
                    lastModified: new Date(parseInt(lastModified)).toString(),
                    convertRequired: false
                })
            } else {
                streams.audios.push({
                    url: url,
                    mimeType: mime ? mime['quality'] : false,
                    qualityLabel: quality,
                    size: Math.round(parseInt(contentLength) / 1024) / 1000 || false,
                    quality: qualityLabel,
                    lastModified: new Date(parseInt(lastModified)).toString(),
                    convertRequired: false
                })
            }
        }

        for (const { url, qualityLabel, contentLength, mimeType, quality, lastModified } of streamingData.adaptiveFormats) {
            const mime = /^video\/(?<quality>[^;]+)/i.exec(mimeType)?.groups

            const token = generateMD5(url)

            if (!token) {
                console.log(streamingData)
                return ExpressResponse(res, false, 400, {
                    message: 'Signed Video Support will be available soon.'
                })
            }
            
            if (/^video/.test(mimeType)) {
                streams.videos.push({
                    url: token,
                    mimeType: mime ? mime['quality'] : false,
                    qualityLabel: quality,
                    size: Math.round(parseInt(contentLength) / 1024) / 1000 || false,
                    quality: qualityLabel,
                    lastModified: new Date(parseInt(lastModified)).toString(),
                    convertRequired: true
                })
                streamSession[token] = {
                    video: url
                }
            } else {
                streams.audios.push({
                    url: url,
                    mimeType: mime ? mime['quality'] : false,
                    qualityLabel: quality,
                    size: Math.round(parseInt(contentLength) / 1024) / 1000 || false,
                    quality: qualityLabel,
                    lastModified: new Date(parseInt(lastModified)).toString(),
                    convertRequired: false
                })
            }
        }
        
        streams.videos.sort((a, b) => {
            return parseInt(a.quality.split('p')[1]) > parseInt(b.quality.split('p')[1]) ? -1 : 1
        })

        thumbnails.sort((a, b) => {
            return a.width > b.width ? -1 : 1
        })

        const response = {
            title: title,
            channel: author,
            id: videoId,
            thumbnail: thumbnails[0],
            streams: streams
        }

        ExpressResponse(res, true, 200, {
            response: response
        })

        const Promises: Array<Promise<boolean>> = []

        for (const key of Object.keys(streamSession)) {
            Promises.push(
                insertRecord(key, JSON.stringify({ ...{ audio: streams.audios[0].url }, ...streamSession[key] }))
            )
        }

        await Promise.all(Promises)
        return
    }
    return ExpressResponse(res, false, 400, 'ERROR')
})

app.get('/yt/convert/:id', async (req, res) => {
    const { params: { id } } = req

    if (!id) {
        return ExpressResponse(res, false, 400, {
            message: 'convert id required'
        })
    }

    return ExpressResponse(res, true, 200, {
        data: await findRecord(id)
    })
})

export default app
