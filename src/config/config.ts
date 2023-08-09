export const PORT = 8080

export const YouTubeRegEx = /^https?:\/\/w{3}[.]youtube[.]com\/watch\?v=(?<vid>[A-z0-9-_]+)/i

export const ENV = {
    NODE_ENV: process.env.NODE_ENV || 'production',
    PORT: process.env.PORT,
    NPM_VERSION: process.env.npm_package_version
}

export const REQUEST_CONFIG = {
    headers: {
        'authority': 'loader.to',
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
}
