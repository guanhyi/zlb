import { HTTP_CLIENT } from '@/shared/http'
import { NgHttp } from '@/shared/http/client'
import { Inject } from '@wendellhu/redi'
import { create } from 'zustand'
import { IResponseType } from './type'
import { Observable } from 'rxjs'

export type AccountUserInfoDTO = {
    /**授权Key */
    token: string

    /**用户在SSO分配的身份唯一号 */
    userid: string

    /**认证级别 1.匿名 2.实名 3.实人 （当认证级别为2或者3的时候实名信息才有效）*/
    authlevel: '1' | '2' | '3'

    /**实名信息 -- 用户真实姓名*/
    username: string

    /**实名信息 -- 证件号码（身份证） */
    idnum: string

    /**实名信息 -- 性别 1男 2女 */
    sex: '1' | '2'

    /**实名信息 -- 民族(见国标GB3304-91) */
    nation: string

    /**登录名 */
    loginname: string

    /**邮件 */
    email: string

    /**手机号码 */
    mobile: string

    /**邮编 */
    postcode: string

    /**CA证书KEY */
    cakey: string

    /**生日 */
    birthday: string

    /**国籍 */
    country: string

    /**省籍 */
    province: string

    /**城市 */
    city: string

    /**办公地址 */
    officeaddress: string

    /**办公电话 */
    officephone: string

    /**办公传真 */
    officefax: string

    /**家庭电话 */
    homephone: string

    /**家庭地址 */
    homeaddress: string

    /**用户激活状态 1激活，2未激活 */
    useable: '1' | '2'

    /**排序 */
    orderby: string

    /**头像地址：http://[sso4]/[ headpicture] 注意：该地址为外网能访问的地址*/
    headpicture: string

    /**来源 */
    from: string

    /**登录次数 */
    loginCount: number

    result: string

    personInfo: {
        cardEndTime: string
        cardStartTime: string
        gender: string
        id: string
        idCard: string
        idType: string
        mobile: string
        realName: string
    }
}

type State = {
    state: Partial<AccountUserInfoDTO>
}
type Action = {
    setState: (state: AccountUserInfoDTO) => void
}

export const useAccountStote = create<State & Action>((set) => ({
    state: {},
    setState: (state) => {
        set((v) => ({ ...v, ...state }))
    }
}))

export class AccountService {
    constructor(@Inject(HTTP_CLIENT) public http: NgHttp) {}

    public zltSso = (ticket: string) => {
        return this.http.get<IResponseType<AccountUserInfoDTO>>('/v1.0/account/zlt_sso', {
            appId: 2024090514537938,
            token: ticket
        })
        // return new Observable((obs) => {
        //     window.zlt_cdk.ready().then(() => {
        //         let ticket = window.zlt_cdk.getToken()
        //         this.http
        //             .get<IResponseType<AccountUserInfoDTO>>('/v1.0/account/zlt_sso', {
        //                 appId: 2024090514537938,
        //                 token: ticket
        //             })
        //             .subscribe((res) => {
        //                 obs.next(res)
        //                 obs.complete()
        //             })
        //     })
        // })
    }
}
