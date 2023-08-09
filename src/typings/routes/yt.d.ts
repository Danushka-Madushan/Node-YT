declare module 'youtube/fetch' {
    interface TQuery {
        url?: string
    }

    interface Tthumbnails {
        url: string,
        width: number,
        height: number
    }

    interface ytResponse {
        videoDetails: {
            videoId: string,
            title: string,
            lengthSeconds: number,
            channelId: string,
            isOwnerViewing: boolean,
            shortDescription: string,
            isCrawlable: boolean,
            thumbnail: {
                thumbnails: Array<Tthumbnails>
            },
            allowRatings: boolean,
            viewCount: number,
            author: string,
            isPrivate: boolean,
            isUnpluggedCorpus: boolean,
            isLiveContent: boolean
        }
    }

    type TQualities = '1440' | '1080' | '720' | '480' | '320' | 'mp3'

    interface TLoaderResponse {
        "success": boolean,
        "id": string,
        "content"?: string,
        "title": string,
        "info": {
            "image": string,
            "title": string
        }
    }
}
