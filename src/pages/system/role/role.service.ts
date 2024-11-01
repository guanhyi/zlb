import { BaseCurd, BaseUrl } from '@/shared/http/decorator'

export /**
 * <p>
 * 角色管理
 * </p>
 *
 */
interface SysRole extends BaseEntity {
    /**
     *  "角色名称")
     */
    name: string

    /**
     *  "编码")
     */
    code: string

    /**
     *  "备注")
     */
    remark: string

    /**
     *  "数据范围  0：全部数据  1：本部门及子部门数据  2：本部门数据  3：本人数据  4：自定义数据")
     */
    dataScope: boolean

    /**
     *  "机构ID")
     */
    orgId: number

    /**
     *  "版本号")
     */
    // private Integer version;

    /**
     *  "状态")
     */
    status: boolean
}

@BaseUrl('/api/system/role')
export class RoleService extends BaseCurd<SysRole> {
    getMenuIds(roleId: string) {
        return this._http.get<RemoteResultDTO<string[]>>(`/api/system/role/getMenuIds`, {
            roleId
        })
    }
    updateRoleMenu(roleId: string, authCode: React.Key[]) {
        return this._http.post<RemoteResultDTO<string[]>>(`/api/system/role/updateRoleMenu`, {
            menuIds: authCode,
            id: roleId
        })
    }
}
