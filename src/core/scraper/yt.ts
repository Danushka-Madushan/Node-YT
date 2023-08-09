import axios from 'axios'
import { TLoaderResponse, TQualities } from 'youtube/fetch';
import { findRecord } from '../redis/cache.js';
import { REQUEST_CONFIG } from '../../config/config.js';

export const fetchYoutube = async (vid: string) => {
    const { data } = await axios.get<string>('https://www.youtube.com/watch', {
        params: {
            'v': vid
        },
        headers: REQUEST_CONFIG.headers
    });

    const Regex = /var ytInitialPlayerResponse = (?<ytInitialPlayerResponse>{.+?});var meta/gm

    return Regex.exec(data)
}

export const initiateConvertProcess = async (quality: TQualities, token: string) => {
    const vid = await findRecord(token)
    if (!vid) { return false }

    const { data } = await axios.get<TLoaderResponse>('https://loader.to/ajax/download.php', {
        params: {
            'format': quality,
            'url': `https://www.youtube.com/watch?v=${ vid }`
        },
        headers: REQUEST_CONFIG.headers
    });

    delete data['content']
    return data
}

export const requestDownload = async (token: string) => {
    const { data } = await axios.get<object>('https://p.oceansaver.in/ajax/progress.php', {
        params: {
            'id': token
        },
        headers: REQUEST_CONFIG.headers
    });

    return data
}
