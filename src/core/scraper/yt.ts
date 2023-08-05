import got from 'got';

export const fetchYoutube = async (vid: string) => {
    const { body } = await got('https://www.youtube.com/watch', {
        searchParams: {
            'v': vid
        },
        headers: {
            'accept-language': 'en-US,en;q=0.9',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.188'
        }
    });

    const Regex = /var ytInitialPlayerResponse = (?<ytInitialPlayerResponse>{.+?});var meta/gm

    return Regex.exec(body)
}

export const requestDownload = async (id: string, token: string) => {
    const response = await got.post('https://yt1s.com/api/ajaxConvert/convert', {
        headers: {
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': '_gid=GA1.2.482438218.1691075328; _ga_SHGNTSN7T4=GS1.1.1691153945.6.0.1691153945.0.0.0; _ga=GA1.2.1863704939.1687515344',
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
            'vid': id,
            'k': token
        }
    }).json<object>();

    return response
}
