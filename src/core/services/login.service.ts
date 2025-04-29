import { HTTP_CLIENT } from '@/shared/http'
import type { NgHttp } from '@/shared/http/client'

import { Inject } from '@wendellhu/redi'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Observable } from 'rxjs'

export type LoginResult = {
    /**ID */
    id: string
    /**用户名 */
    username: string
    /**姓名 */
    realName: string
    /**权限码集合 */
    permissionList: string[]
    /**角色编码集合 */
    roleList: string[]
    /**令牌 */
    token: string
    /**登录IP */
    ip: string
    /**登录地址 */
    address: string
    /**浏览器类型 */
    browser: string
    os: string
}

/**
 * <p>
 * 用户管理VO
 * </p>
 *
 * @author cxy
 * @since 2023-09-11
 */
export interface SysUserVO {
    accountId: string
    token: string
    id: any

    /**
     *  "用户名"
     *  */
    username: string

    /**
     *  "密码"
     *  */
    password: string

    /**
     *  "姓名"
     *  */
    realName: string

    /**
     *  "头像"
     *  */
    avatar: string

    /**
     *  "性别   0：男   1：女   2：未知"
     *  */
    gender: boolean

    /**
     *  "邮箱"
     *  */
    email: string

    /**
     *  "手机号"
     *  */
    mobile: string

    /**
     *  "部门ID"
     *  */
    deptId: number

    /**
     *  "超级管理员   0：否   1：是"
     *  */
    superAdmin: 0 | 1

    /**
     *  "状态  0：停用   1：正常"
     *  */
    status: boolean

    /**
     *  "版本号"
     *  */
    version: number

    /**
     *  "创建时间"
     *  */
    createTime: string

    /**
     *  "部门名称"
     *  */
    deptName: string
    areaCode: string
}
const path = '/v1/app/zzd'

export class LoginService {
    constructor(@Inject(HTTP_CLIENT) public http: NgHttp) {}

    accountLogin(form?: any) {
        return this.http.post<any>(
            `${path}/simulation_login`,
            {},
            {
                params: form
            }
        )
    }

    appLoginId(id: string) {
        return this.http.get<any>(`${path}/app-login-id`, {
            userId: id
        })
    }

    appSso(authCode?: any) {
        return this.http.get<any>(`${path}/app-sso`, {
            authCode: authCode
        })
    }

    getMyResources() {
        return this.http.get<any>(`${path}/get_my_resources`, {})
    }
}

export const useLoginService = () => {
    const loginService = useDependency(LoginService)

    return {
        ...loginService
    }
}
