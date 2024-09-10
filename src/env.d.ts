/// <reference types="@rsbuild/core/types" />
interface Window {
    zlt_cdk: {
        getToken: () => string
        goFace: () => void
        getFacePass: () => boolean
        ready: () => Promise<any>
    }
}
