declare module 'youtube/fetch' {
    export namespace YTFetchRequest {
        interface TQuery {
            url?: string
        }
    }

    export namespace YTConvertRequest {
        interface TBody {
            id: string,
            token: string
        }
    }
}
