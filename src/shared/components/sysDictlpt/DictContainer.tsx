import { SysDictItemVO } from '@/core/services/system/SysDictItemLittleService'

import { useDependency } from '@wendellhu/redi/react-bindings'
import { useEffect, useState } from 'react'
import { DictIdProps } from './DictIdProps'
import { SysDeptService, SysDeptVO } from '@/core/services/system/SysDeptService'
import { SysDictItemService } from '@/core/services/system/SysDictItemService'

type DCode = DictIdProps | 'DEPT' | 'APPROVE_STATUS' | 'BOOLEAN_STATUS'

type P<CodeType = SysDictItemVO> = {
    code: DCode
    children:
        | React.ReactNode
        | ((
              codes: SysDictItemVO[],
              fieldNames: {
                  value: string
                  label: string
              }
          ) => React.ReactNode)
}

const BOOLEAN_ENUM = [
    {
        dictName: '是',
        dictValue: true,
        id: true,
        dictId: true
    },
    {
        dictName: '否',
        dictValue: false,
        id: false,
        dictId: false
    }
]

const APPROVE_STATUS_ENUM = [
    {
        //@ts-ignore
        dictName: '已处理',
        id: '1',
        dictValue: '1',
        dictId: '1'
    },
    {
        //@ts-ignore
        dictName: '未处理',
        dictValue: '0',
        id: '0',
        dictId: '0'
    }
]
const fieldNames = {
    value: 'id',
    label: 'dictName'
}
const scanDeptToDict = (arr: SysDeptVO[]): SysDictItemVO[] => {
    return arr.map((item) => {
        if (item.children) {
            return {
                id: item.id,
                dictName: item.name,
                dictCode: item.id,
                dictValue: item.id,
                dictId: item.id,
                children: scanDeptToDict(item.children),
                remark: item.remark,
                sort: item.sort,
                pid: item.pid,
                createTime: item.createTime
            } as unknown as SysDictItemVO
        } else {
            return {
                id: item.id,
                dictName: item.name,
                dictCode: item.id,
                dictValue: item.id,
                dictId: item.id,
                remark: item.remark,
                sort: item.sort,
                pid: item.pid,
                createTime: item.createTime
            } as unknown as SysDictItemVO
        }
    })
}

export function useDictCode(
    code: DCode[],
    begin?: boolean
): {
    dictItem: SysDictItemVO[][]
    getCode: () => void
}
export function useDictCode(
    code: DCode,
    begin?: boolean
): {
    dictItem: SysDictItemVO[]
    getCode: () => void
}
export function useDictCode(code: DCode | DCode[], begin = true) {
    const sysDeptService = useDependency(SysDeptService)
    const sysDictItemService = useDependency(SysDictItemService)
    const [dictItem, setDictItems] = useState<SysDictItemVO[] | SysDictItemVO[][]>(
        code instanceof Array ? (Array.from({ length: code.length }) as SysDictItemVO[][]) : []
    )

    const getCode = () => {
        if (code instanceof Array) {
            code.map((item, index) => {
                if (item === 'DEPT') {
                    sysDeptService.listBy().then((res) => {
                        setDictItems((v) => {
                            v[index] = scanDeptToDict(res)
                            return [...v] as SysDictItemVO[][]
                        })
                    })
                    return
                }
                if (item === 'APPROVE_STATUS') {
                    //@ts-ignore
                    setDictItems((v) => {
                        //@ts-ignore
                        v[index] = APPROVE_STATUS_ENUM
                        return [...v] as SysDictItemVO[][]
                    })
                    return
                }
                if (item === 'BOOLEAN_STATUS') {
                    //@ts-ignore
                    setDictItems((v) => {
                        //@ts-ignore
                        v[index] = BOOLEAN_ENUM
                        return [...v] as SysDictItemVO[][]
                    })
                    return
                }
                sysDictItemService.listByCode(item).then((res) => {
                    const data = res.data as SysDictItemVO[]
                    setDictItems((v) => {
                        v[index] = data
                        return [...v] as SysDictItemVO[][]
                    })
                })
            })
        } else {
            if (code === 'DEPT') {
                sysDeptService.listBy().then((res) => {
                    setDictItems(scanDeptToDict(res))
                })

                return
            }
            if (code === 'APPROVE_STATUS') {
                //@ts-ignore
                setDictItems(APPROVE_STATUS_ENUM)
                return
            }
            if (code === 'BOOLEAN_STATUS') {
                //@ts-ignore
                setDictItems(BOOLEAN_ENUM)
                return
            }
            sysDictItemService.listByCode(code).then((res) => {
                const data = res.data as SysDictItemVO[]
                setDictItems(data)
            })
        }
    }

    useEffect(() => {
        if (!begin) return
        getCode()
    }, [code])

    return {
        dictItem,
        getCode
    }
}

/**获取 code 容器 */
export function DictContainer<CodeType = SysDictItemVO>(props: P<CodeType>) {
    const { dictItem } = useDictCode(props.code)

    if (typeof props.children === 'function') {
        return props.children(dictItem, fieldNames)
    } else {
        return props.children
    }
}

type DictArrayContainerProp = {
    code: DCode[]
    children:
        | React.ReactNode
        | ((
              codes: SysDictItemVO[][],
              fieldNames: {
                  value: string
                  label: string
              }
          ) => React.ReactNode)
}

export function DictArrayContainer(props: DictArrayContainerProp) {
    const { dictItem } = useDictCode(props.code)

    if (typeof props.children === 'function') {
        return props.children(dictItem, {
            value: 'id',
            label: 'dictName'
        })
    } else {
        return props.children
    }
}
