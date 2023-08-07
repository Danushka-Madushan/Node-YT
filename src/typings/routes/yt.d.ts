declare module 'youtube/fetch' {
    interface TQuery {
        url?: string
    }

    interface TFormats {
        itag: number,
        url: string,
        mimeType: string,
        bitrate: number,
        width: number,
        height: number,
        lastModified: string,
        contentLength: string,
        quality: string,
        fps: number,
        qualityLabel: string,
        projectionType: string,
        averageBitrate: number,
        approxDurationMs: string,
        audioQuality: string,
        audioSampleRate: string,
        audioChannels: number
    }

    interface TRange {
        start: string,
        end: string
    }

    interface Tthumbnails {
        url: string,
        width: number,
        height: number
    }

    interface ytResponse {
        streamingData: {
            expiresInSeconds: string,
            formats: Array<TFormats>,
            adaptiveFormats: Array<Omit<TFormats, 'audioQuality' | 'audioSampleRate' | 'audioChannels'> & { initRange: TRange, indexRange: TRange }>
        },
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
