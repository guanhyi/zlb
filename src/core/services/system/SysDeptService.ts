import { BaseCurd, BaseUrl } from '@/shared/http/decorator'
import { signal } from '@preact/signals-react'
import { lastValueFrom } from 'rxjs'

/**
 * <p>
 * 部门VO
 * </p>
 *
 * @author cxy
 * @since 2023-08-24
 */
export interface SysDeptVO {
    id: string

    /**
     *  "部门名称
     *  */
    name: string

    /**
     *  "部门备注
     *  */
    remark: string

    /**
     *  "部门负责人
     *  */
    ownerUserId: string

    /**
     *  "排序
     *  */
    sort: string

    /**
     *  "版本号
     *  */
    version: string

    /**
     *  "创建时间
     *  */
    createTime: string
    children?: SysDeptVO[]
    pid?: string
}

/**
 * 菜单数据 服务
 */
@BaseUrl('/api/system/dept')
export class SysDeptService extends BaseCurd<SysDeptVO> {
    Depts = signal<SysDeptVO[]>([])

    /**
     *
     * @param force 是否强制刷新缓存
     * @returns
     */
    listBy = async (force: boolean = false): Promise<SysDeptVO[]> => {
        if (!force && Array.isArray(this.Depts.value) && this.Depts.value.length > 0) {
            return this.Depts.value
        }
        const source$ = this._http.get<RemoteResultDTO<SysDeptVO[]>>(`${this.path}/list`)
        const res = await lastValueFrom(source$)
        if (res.success) {
            this.Depts.value = res.data
        }
        return res.data
    }

    /**
     *  找出指定id 的所有顶级节点id 摊平数据
     * */
    getPID = (id: string) => {
        const depts = this.flattenItems(this.Depts.value as any, 'children')
        //@ts-ignore
        const dept = depts.find((e) => e.id == id)
        if (!dept) {
            return []
        }
        const deptIds: string[] = [id]
        //@ts-ignore
        let pid = dept.pid
        while (true) {
            //@ts-ignore
            const pDept = depts.find((e) => e.id == pid)
            if (pDept) {
                //@ts-ignore
                pid = pDept.pid
                //@ts-ignore
                deptIds.unshift(pDept.id)
            } else {
                break
            }
        }

        return deptIds
    }
}
