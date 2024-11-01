import { BaseAuth, BaseCurd, BaseUrl } from '@/shared/http/decorator'

import { lastValueFrom } from 'rxjs'
import { SysDictItemVO } from './SysDictItemLittleService'
import { DictIdProps } from '@/shared/components/sysDictlpt/DictIdProps'

/**
 * 字典数据 服务
 */
@BaseAuth('dictItem')
@BaseUrl('/api/system/dictItem')
export class SysDictItemService extends BaseCurd<SysDictItemVO> {
    /**
     * 根据字典名称 获取字典
     * @param code  字典名称
     * @returns
     */
    listByCode = async (code: DictIdProps) => {
        const source$ = this._http.get<RemoteResultDTO<SysDictItemVO[]>>(
            `${this.path}/listByCode?code=${code}`,
            {}
        )
        return await lastValueFrom(source$)
    }

    /**
     * 获取字典
     * @param code  字典名称
     * @returns
     */
    getList = async (code: any) => {
        const source$ = this._http.get<RemoteResultDTO<SysDictItemVO[]>>(`${this.path}/list`, {
            ...code
        })
        return await lastValueFrom(source$)
    }
}
