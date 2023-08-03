declare module 'scraper/youtube' {
    interface TKeyObject {
        [key: string]: {
            size: string
            f: string,
            q: string,
            q_text?: string,
            k: string
        }
    }

    interface TLinks {
        "mp4": TKeyObject,
        "m4a"?: TKeyObject,
        "mp3"?: TKeyObject,
        "3gp"?: TKeyObject
    }

    export interface TResponse {
        "status": string,
        "mess": string,
        "p": string,
        "vid": string,
        "title": string,
        "t": number,
        "a": string,
        "links": TLinks
    }

}
