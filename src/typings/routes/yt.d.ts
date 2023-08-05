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

    type TStreamsArray = Pick<TFormats, 'lastModified' | 'quality' | 'size' | 'qualityLabel' | 'url'> & {
        'mimeType': string | boolean,
        convertRequired: boolean
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

    interface TStreamSession {
        [key: string]: {
            video?: string,
            audio?: string
        }
    }
}
