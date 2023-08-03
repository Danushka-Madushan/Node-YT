declare module 'routes/base-route' {
    export namespace TYTRequest {

        interface TQuery {
            year?: string,
            user?: string
        }
    }

    export namespace TFBRequest {

        interface TQuery {
            year?: string,
            user?: string
        }
    }
}
