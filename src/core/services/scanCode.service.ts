import { NgHttp } from '@/shared/http/client'
import { HTTP_CLIENT } from '@/shared/http'
import { Inject } from '@wendellhu/redi'
import { IResponseType } from './type'

export type ScanConfigType = {
    _createOn: string
    _updateOn: string
    accessControlConfigId: string
    orgName: string
    orgAddress: string
    sceneCode: string
    qrIdNumber: string
    sceneName: string
    siteName: string
    areaName: string
    areaConfig: {
        areaName: string
        areaCode: string
        copyright: string
        bannerUrl: string
        enableStatus: number
        id: string
        createTime: string
    }
    streetName: string
    villageName: string
    position: string
    accessControlType: number
    formElements: {
        value: string
    }
    needScanFace: number
    enableSignOn: number
    siteType: number
    enableNews: number
    enableStatus: 1
    copyright: string
    qrDownloadUrl: string
    qrRuleCode: string
}

export type FormElementsType = {
    key: string
    label?: string
    placeholder?: string
}

export class ScanCodeSerivce {
    constructor(@Inject(HTTP_CLIENT) public http: NgHttp) {}

    getConfig = (code: string) => {
        return this.http.get<IResponseType<ScanConfigType>>('/v1.0/access_control/get_config', {
            sceneCode: code
        })
    }

    postSubmit = (data: any) => {
        data.source = 'zlb'

        return this.http.post<
            IResponseType<{
                acsCode: string
            }>
        >('/v1.0/access_control/post', data)
    }

    accessControlPost = (
        data: Partial<{
            position: number[] // ["119.9021144577703", "28.469410287983106"]
            postType: 1 | 0 // 1表示代填，0表示当前用户
            sceneCode: string //'ld-hz'
            source: string //'zlb'
            idnum: string // "3****************X"
            interviewee: string //  "  来讨债的"
            mobile: string // "155******67"
            reasonsForVisit: string // "办事"
            sceneName: string // 丽水市政府访客登记码
            username: string //"**阳"
            visitPlace: string // "vs"
            cardNo: string
        }>
    ) => {
        data.source = 'zlb'

        return this.http.post<IResponseType<any>>('/v1.0/access_control/access_control_post', data)
    }
}
