import axios from 'axios'
import { TLoaderResponse, TQualities } from 'youtube/fetch';
import { findRecord } from '../redis/cache.js';

export const fetchYoutube = async (vid: string) => {
    const { data } = await axios.get<string>('https://www.youtube.com/watch', {
        params: {
            'v': vid
        },
        headers: {
            'accept-language': 'en-US,en;q=0.9',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188'
        }
    });

    const Regex = /var ytInitialPlayerResponse = (?<ytInitialPlayerResponse>{.+?});var meta/gm

    return Regex.exec(data)
}

export const initiateConvertProcess = async (quality: TQualities, token: string) => {
    const vid = await findRecord(token)
    if (!vid) {
        return {}
    }
    const { data } = await axios.get<TLoaderResponse>('https://loader.to/ajax/download.php', {
        params: {
            'format': quality,
            'url': `https://www.youtube.com/watch?v=${ vid }`
        },
        headers: {
            'authority': 'loader.to',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188'
        }
    });

    delete data['content']

    return data
}

export const requestDownload = async (token: string) => {
    const { data } = await axios.get<object>('https://p.oceansaver.in/ajax/progress.php', {
        params: {
            'id': token
        },
        headers: {
            'authority': 'p.oceansaver.in',
            'accept': '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'cache-control': 'no-cache',
            'dnt': '1',
            'origin': 'https://en.loader.to',
            'pragma': 'no-cache',
            'referer': 'https://en.loader.to/',
            'sec-ch-ua': '"Not/A)Brand";v="99", "Microsoft Edge";v="115", "Chromium";v="115"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188'
        }
    });

    return data
}
