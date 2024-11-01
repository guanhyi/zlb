import { DictIdProps } from '@/shared/components/sysDictlpt/DictIdProps'
import { NgHttp } from '@/shared/http/client'
import { lastValueFrom } from 'rxjs'

/**
 * <p>
 * 字典项VO
 * </p>
 *
 * @author cxy
 * @since 2023-09-03
 */
export interface SysDictItemVO {
    /**
     * "id
     *  */
    id: any

    /**
     * "字典类型ID
     *  */
    dictId: any

    /**
     * "字典名称
     *  */
    dictName: string

    /**
     * "字典值
     *  */
    dictValue: string

    /**
     * "字典样式
     *  */
    dictClass: string

    /**
     * "备注
     *  */
    remark: string

    /**
     * "排序
     *  */
    sort: any

    /**
     * "状态  0： 1：正常"
     *  */
    status: 0 | 1

    /**
     * "创建时间
     *  */
    createTime: string

    pid?: string
}

export class SysDictItemLittleService {
    constructor(public _http: NgHttp) {}
    /**
     * 根据菜单id 获取页面的按钮
     * @param id 菜单id
     * @returns
     */
    listByCode = async (code: DictIdProps) => {
        const source$ = this._http.get<RemoteResultDTO<SysDictItemVO[]>>(
            `/api/system/dictItem/listByCode?code=${code}`,
            {}
        )
        return await lastValueFrom(source$)
    }
}
