import { BaseCurd, BaseUrl } from '@/shared/http/decorator'

/**
 * <p>
 * 用户管理
 * </p>
 *
 */
export interface SysUser extends BaseEntity {
    token: string
    id: any
    /**
     *  "用户名
     */
    username: string

    /**
     *  "密码
     */
    password: string

    /**
     *  "姓名
     */
    realName: string

    /**
     *  "头像
     */
    avatar: string

    /**
     *  "性别
     */
    gender: boolean

    /**
     *  "邮箱
     */
    email: string

    /**
     *  "手机号
     */
    mobile: string

    /**
     *  "部门ID
     */
    deptId: number

    /**
     *  "超级管理员
     */
    superAdmin: boolean

    /**
     *  "状态
     */
    status: boolean

    /**
     *  "版本号
     */
    version: number

    /**
     *  "部门名称
     */
    deptName: string
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

/**
 * 用户服务
 */
//@ts-ignore
@BaseUrl('/api/system/user')
export class SysUserService extends BaseCurd<SysUser> {
    //@ts-ignore
    page = (pageConfig: SysUserReq) => {
        return this._http
            .post<RemoteResultDTO<PageRes<SysUserVO[]>>>(`${this.path}/page`, {
                ...pageConfig
            })
            .pipe(this.requestLoading.requestChangeLoading())
    }

    newUser = (form: any) => {
        return this._http
            .post<RemoteResultDTO<PageRes<SysUserVO[]>>>(`${this.path}/add`, {
                ...form
            })
            .pipe(this.requestLoading.requestChangeLoading())
    }
}
