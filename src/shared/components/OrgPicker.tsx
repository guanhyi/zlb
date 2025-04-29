import { DictDTO, useDataDictionaryService } from '@/core/services/data_dictionary.service'
import { OrgDTO, useOrgService } from '@/core/services/org.service'
import { Cascader, CheckList, Picker, Popup } from 'antd-mobile'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
type Props<T = any> = {
    value?: any
    multiple?: boolean
    onChange?: (value: string) => void
}
export type OrgRef = {
    open: () => void
}

function transformData(input: any) {
    const result = [] as any

    // Helper function to recursively process children
    function processChildren(children: any) {
        return children.map((child: any) => {
            const node = {
                label: child.name,
                value: child.id
            }

            if (child.children && child.children.length > 0) {
                //@ts-ignore
                node.children = processChildren(child.children)
            }

            return node
        })
    }

    // Process the main children (政府机构, 街道, etc.)
    input.children.forEach((child: any) => {
        const node = {
            label: child.name,
            value: child.id
        }

        if (child.children && child.children.length > 0) {
            //@ts-ignore

            node.children = processChildren(child.children)
        }

        result.push(node)
    })

    return result
}

function _OrgPicker<T>({ ...props }: Props<T>, ref: React.Ref<OrgRef | undefined>) {
    const orgService = useOrgService()
    const [visible, setVisible] = useState(false)
    const [orgList, setOrgList] = useState<any[]>([])
    const [value1, setValue1] = useState<string[]>([])
    const open = () => {
        setVisible(true)
    }
    useImperativeHandle(ref, () => ({ open }))
    const [selected, setSelected] = useState('A')
    useEffect(() => {
        orgService.getOrgTree().subscribe((res) => {
            const newArr = res.data.map((e: any) => {
                return {
                    label: e.name,
                    value: e.id
                }
            })

            console.log(transformData(res.data[0]))

            setOrgList(transformData(res.data[0]))
        })
    }, [])
    return (
        <div>
            <Cascader
                onConfirm={(v) => {
                    // if (props.value) {
                    //     console.log([props.value, v[v.length - 1]])
                    // }
                    setValue1(v as any)
                    props.onChange && props.onChange(v[v.length - 1] as string)
                    setVisible(false)
                }}
                visible={visible}
                value={value1}
                onCancel={() => {
                    setVisible(false)
                }}
                options={orgList}
            >
                {(items) => {
                    if (items.every((item) => item === null)) {
                        return '未选择'
                    } else {
                        return items.map((item) => item?.label ?? '未选择').join('-')
                    }
                }}
            </Cascader>
            {/* <Popup
                visible={visible}
                onMaskClick={() => {
                    setVisible(false)
                }}
                destroyOnClose
            >
                <CheckList
                    multiple
                    onChange={(val) => {
                        setVisible(false)
                    }}
                >
                    {orgList.map((item) => (
                        <CheckList.Item key={item.label} value={item.label}>
                            <div>{item.label}</div>
                            <div>
                                {item.children.map((e: any) => {
                                    return (
                                        <CheckList
                                            key={e.value}
                                            multiple
                                            onChange={(val) => {
                                                setVisible(false)
                                            }}
                                        >
                                            <CheckList.Item key={e.label} value={e.label}>
                                                {e.label}
                                            </CheckList.Item>
                                        </CheckList>
                                    )
                                })}
                            </div>
                        </CheckList.Item>
                    ))}
                </CheckList>
            </Popup> */}
        </div>
    )
}

export const OrgPicker = forwardRef(_OrgPicker) as <T>(
    props: Props<T> & { ref?: React.ForwardedRef<OrgRef | undefined> }
) => ReturnType<typeof _OrgPicker>
