import { useAdminUserService } from '@/core/services/admin_user.service'
import { DictDTO, useDataDictionaryService } from '@/core/services/data_dictionary.service'
import { Picker } from 'antd-mobile'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
type Props<T = any> = {
    orgId: string
    value?: string
    onChange?: (value: string) => void
}
export type UserByOrgIdRef = {
    open: () => void
}
function _UserByOrgId<T>({ ...props }: Props<T>, ref: React.Ref<UserByOrgIdRef | undefined>) {
    const adminUserService = useAdminUserService()
    const [visible, setVisible] = useState(false)
    const [dictList, setDictList] = useState<any>([])

    const fetchUsers = () => {
        adminUserService.getAdminUserByOrg({ orId: props.orgId }).subscribe((res) => {
            const newArr = res.data.map((e) => {
                return {
                    label: e.username,
                    value: e.id
                }
            })
            setDictList([newArr])
        })
    }

    const open = () => {
        setVisible(true)
    }

    useImperativeHandle(ref, () => ({ open }))

    useEffect(() => {
        if (props.orgId) {
            fetchUsers()
        }
    }, [props.orgId])

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
                onClose={() => {
                    setVisible(false)
                }}
            >
                {(items, { open }) => {
                    return <div>{items[0]?.label}</div>
                }}
            </Picker>
        </div>
    )
}

export const UserByOrgId = forwardRef(_UserByOrgId) as <T>(
    props: Props<T> & { ref?: React.ForwardedRef<UserByOrgIdRef | undefined> }
) => ReturnType<typeof _UserByOrgId>
