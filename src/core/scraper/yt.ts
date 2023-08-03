import axios from 'axios';
import { TResponse } from 'scraper/youtube';

interface TRes {
    data: TResponse
}

export const fetchYoutube = async (url: string): Promise<TRes> => {
    const response: TRes = await axios.post(
    'https://yt1s.com/api/ajaxSearch/index', new URLSearchParams(
        {
            'q': url,
            'vt': 'home'
        }
    ),
    {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51'
        }
    })

    return response
}

export const requestDownload = async (id: string, token: string) => {
    const { data } = await axios.post<TRes>(
    'https://yt1s.com/api/ajaxConvert/convert', new URLSearchParams(
        {
            'vid': id,
            'k': token
        }
    ),
    {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36 Edg/114.0.1823.51'
        }
    })

    return data
}
