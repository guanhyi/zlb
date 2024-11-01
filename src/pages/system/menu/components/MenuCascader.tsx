import { SysMenuService, SysMenuVO } from '@/core/services/menu.service'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Cascader } from 'antd'
import { useState, useEffect } from 'react'
import { useMount } from 'ahooks'
type P = {
    id?: string
    value?: string
    onChange?: (icon: string) => void
}

export const MenuCascader: React.FC<P> = (props: P) => {
    const sysMenuService = useDependency(SysMenuService)
    const [menuIds, setMenuIds] = useState<string[]>()
    const [menus, setMenus] = useState<any[]>([])
    useMount(() => {
        loadData()
    })
    const loadData = () => {
        sysMenuService.listByType(4).then((res) => {
            setMenus(sysMenuService.removeNullChild(res))
            // if (!props.value) {
            //     setMenuIds([])
            //     return
            // }
            // const pids = sysMenuService.getPID(menus, props.value)
            // console.log(pids, 'pids', props.value)

            // setMenuIds(pids)
        })
    }

    useEffect(() => {
        if (!props.value) {
            setMenuIds([])
            return
        }
        const pids = sysMenuService.getPID(menus, props.value)
        setMenuIds(pids)
    }, [props.value, menus])

    const onChange = (value: string[]) => {
        if (!value) {
            return
        }
        // @ts-ignore
        props.onChange && props.onChange(value.pop())
    }

    return (
        <Cascader
            expandTrigger="hover"
            changeOnSelect
            value={menuIds}
            onChange={onChange}
            options={menus}
            placeholder="请选择上级部门"
            fieldNames={{
                label: 'title',
                value: 'id'
            }}
        />
    )
}
