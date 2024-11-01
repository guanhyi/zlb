import { HTTP_CLIENT } from '@/shared/http'
import type { NgHttp } from '@/shared/http/client'
import { Inject } from '@wendellhu/redi'

import { signal } from '@preact/signals-react'
import { useAuthStore } from '../auth.service'

export type DictItemDTO = {
    /**id */
    id: string
    /**字典编码 */
    dictCode: string
    /**字典名称 */
    dictName: string
    /**备注 */
    remark: string
    children: DictItemDTO[]
}

const category = [
    {
        value: 'Consultation',
        label: '咨询'
    },
    {
        value: 'Help',
        label: '求助'
    },
    {
        value: 'Recommendations',
        label: '建议'
    },
    {
        value: 'Complaints',
        label: '投诉'
    },
    {
        value: 'Report',
        label: '举报'
    }
]

const processStatus = [
    {
        value: 0,
        label: '待分配'
    },
    {
        value: 1,
        label: '待受理'
    },
    {
        value: 10,
        label: '受理中'
    },
    {
        value: 20,
        label: '已完结'
    },
    {
        value: 30,
        label: '已评价'
    },
    {
        value: -1,
        label: '退回'
    }
]

const areaCode = [
    {
        value: '331101',
        label: '市本级'
    },
    {
        value: '331102',
        label: '莲都区'
    },
    {
        value: '331121',
        label: '青田县'
    },
    {
        value: '331122',
        label: '缙云县'
    },
    {
        value: '331123',
        label: '遂昌县'
    },
    {
        value: '331124',
        label: '松阳县'
    },
    {
        value: '331125',
        label: '云和县'
    },
    {
        value: '331126',
        label: '庆元县'
    },
    {
        value: '331127',
        label: '景宁县'
    },
    {
        value: '331151',
        label: '开发区'
    },
    {
        value: '331181',
        label: '龙泉市'
    }
]

const processLevel = [
    {
        label: '一级事件（1工作日）',
        value: 1
    },
    {
        label: '二级事件（3工作日）',
        value: 2
    },
    {
        label: '三级事件（7工作日）',
        value: 3
    },
    {
        label: '四级事件（10工作日）',
        value: 4
    },
    {
        label: '五级事件（15工作日）',
        value: 5
    }
]

// const palteList = signal<PlateTDO[]>([])
export class CodeService {
    constructor(
        @Inject(HTTP_CLIENT) public http: NgHttp // @Inject(AuthService) public authService: AuthService
    ) {}

    getCode(codeName: string) {
        return this.http.get<RemoteResultDTO<DictItemDTO[]>>('/api/dict/get_dict_list', {
            code: codeName
        })
    }
    getDemandType() {
        return this.getCode('demand_type')
    }
    getDemandTag() {
        return this.getCode('user_demand_tag')
    }

    getCategory() {
        return category
    }
    getProcessStatus() {
        return processStatus
    }
    getProcessStatusName(status: number) {
        return processStatus.filter((it) => it.value === status)[0]?.label
    }
    getAreaCode() {
        return areaCode
        let auth = useAuthStore.getState()
        if (!auth.user) {
            return []
        }

        return auth.user.superAdmin === 1
            ? areaCode
            : areaCode.filter((item) => item.value === auth.user?.areaCode)
    }
    getprocessLevel() {
        return processLevel
    }

    getAllAearCode() {
        return areaCode
    }
    // getPlate() {
    //     if (palteList.value.length) {
    //         return palteList.value
    //     } else {
    //         this.http
    //             .post<API.RemoteResultDTO<PlateTDO[]>>('/api/service_plate/get_list', {
    //                 areaCode: this.authService.userInfo.value?.areaCode
    //             })
    //             .subscribe((res) => {
    //                 palteList.value = res.data
    //                 return palteList.value
    //             })
    //     }
    // }
}
