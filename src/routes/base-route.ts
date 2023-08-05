import { Router, Request, Response } from 'express';
import { ExpressResponse } from '../core/utils/response.js';
const app = Router()

import { TQuery, TStreamSession, TStreamsArray, ytResponse } from 'youtube/fetch';
import { fetchYoutube } from '../core/scraper/yt.js';
import { generateMD5 } from '../core/utils/hash.js';
import { findRecord, insertRecord } from '../core/redis/cache.js';
import got from 'got';

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

app.get('/yt/yt1s/:id', async (req, res) => {
    const { params: { id } } = req

    const { body } = await got.post('https://yt1s.com/api/ajaxSearch/index', {
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': '_ga_SHGNTSN7T4=GS1.1.1691242563.8.0.1691242563.0.0.0; _ga=GA1.2.1863704939.1687515344; _gid=GA1.2.1862366645.1691242564; _gat_gtag_UA_173445049_1=1',
            'DNT': '1',
            'Origin': 'https://yt1s.com',
            'Pragma': 'no-cache',
            'Referer': 'https://yt1s.com/en607',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188',
            'X-Requested-With': 'XMLHttpRequest',
            'sec-ch-ua': '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"'
        },
        form: {
            'q': 'https://www.youtube.com/watch?v=fWQgWbpEjrE',
            'vt': 'home'
        }
    })

    if (!id) {
        return ExpressResponse(res, false, 400, {
            message: 'convert id required'
        })
    }

    return ExpressResponse(res, true, 200, {
        data: body
    })
})

export default app
