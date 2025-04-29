import { DictDTO, useDataDictionaryService } from '@/core/services/data_dictionary.service'
import { Picker } from 'antd-mobile'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
type Props<T = any> = {
    module: string
    value?: string
    onChange?: (value: string) => void
}
export type DictRef = {
    open: () => void
}
function _DictPicker<T>({ ...props }: Props<T>, ref: React.Ref<DictRef | undefined>) {
    const dictService = useDataDictionaryService()
    const [visible, setVisible] = useState(false)
    const [dictList, setDictList] = useState<any>([])
    const open = () => {
        setVisible(true)
    }
    useImperativeHandle(ref, () => ({ open }))
    useEffect(() => {
        dictService.getDictList({ module: props.module }).subscribe((res) => {
            const newArr = res.data.map((e) => {
                return {
                    label: e.name,
                    value: e.id
                }
            })
            setDictList([newArr])
        })
    }, [])
    return (
        <div>
            <Picker
                onConfirm={(v) => {
                    props.onChange && props.onChange(v[0] as string)
                    setVisible(false)
                }}
                visible={visible}
                value={[props.value || '']}
                columns={dictList}
            >
                {(items, { open }) => {
                    return <div>{items[0]?.label}</div>
                }}
            </Picker>
        </div>
    )
}

export const DictPicker = forwardRef(_DictPicker) as <T>(
    props: Props<T> & { ref?: React.ForwardedRef<DictRef | undefined> }
) => ReturnType<typeof _DictPicker>
