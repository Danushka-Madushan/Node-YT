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
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
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
