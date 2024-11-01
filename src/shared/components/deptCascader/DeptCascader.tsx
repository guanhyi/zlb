import React, { useEffect, useState } from 'react'
import { Cascader } from 'antd'
import { useDependency } from '@wendellhu/redi/react-bindings'

import { useMount } from 'ahooks'
import { SysDeptService } from '@/core/services/system/SysDeptService'

type P = {
    id?: string
    value?: string
    onChange?: (icon: string) => void
    disabled?: boolean
    placeholder?: string
}

export const DeptCascader: React.FC<P> = (props: P) => {
    const sysDeptService = useDependency(SysDeptService)
    const [deptIds, setDeptIds] = useState<string[]>()

    useEffect(() => {
        if (!props.value) {
            setDeptIds([])
            return
        }
        const pids = sysDeptService.getPID(props.value)
        setDeptIds(pids)
    }, [props.value])
    useMount(() => {
        console.log(2)

        sysDeptService.listBy()
    })
    const onChange = (value: (string | number)[]) => {
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
            disabled={props.disabled}
            value={deptIds}
            onChange={onChange}
            options={sysDeptService.Depts.value}
            placeholder={props?.placeholder || '请选择上级部门'}
            fieldNames={{
                label: 'name',
                value: 'id'
            }}
        />
    )
}
