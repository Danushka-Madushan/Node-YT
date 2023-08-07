import { Router, Request, Response } from 'express';
import { ExpressResponse } from '../core/utils/response.js';
const app = Router()

import { TQualities, TQuery, ytResponse } from 'youtube/fetch';
import { fetchYoutube, initiateConvertProcess, requestDownload } from '../core/scraper/yt.js';
import { generateMD5 } from '../core/utils/hash.js';
import { insertRecord } from '../core/redis/cache.js';

const VIDRegex = /^https?:\/\/w{3}[.]youtube[.]com\/watch\?v=(?<vid>[A-z0-9-_]+)/i

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
        const resp = JSON.parse(data.groups.ytInitialPlayerResponse) as ytResponse
        const { videoDetails: { title, videoId, author, thumbnail: { thumbnails } } } = resp
        
        const token = generateMD5(videoId)

        const response = {
            title: title,
            channel: author,
            token: token,
            thumbnail: thumbnails[0],
        }

        ExpressResponse(res, true, 200, {
            response: response
        })

        if (token) {
            await insertRecord(token, videoId)
        }
        return
    }

    return ExpressResponse(res, false, 400, 'ERROR')
})

/*
{
    "quality": '1440' | '1080' | '720' | '480' | '320' | 'mp3',
    "token": "fipWTpQUB5QjzRyZ9fQaPMngFTO"
}
*/
app.post('/yt/request', async (req: Request<object, object, { quality: TQualities, token: string }>, res) => {
    const { body: { quality, token } } = req
    if (!quality || !token) {
        return ExpressResponse(res, false, 400, {
            message: 'body content missing'
        })
    }

    const response = await initiateConvertProcess(quality, token)
    return ExpressResponse(res, true, 200, response)
})

app.get('/yt/convert/:id', async (req, res) => {
    const { params: { id } } = req

    if (!id) {
        return ExpressResponse(res, false, 400, {
            message: 'convert id required'
        })
    }

    return ExpressResponse(res, true, 200, {
        data: await requestDownload(id)
    })
})


export default app
