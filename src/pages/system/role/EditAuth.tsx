import { create, useModal } from '@ebay/nice-modal-react'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { useMount } from 'ahooks'
import { Button, Drawer, Form, Tree, TreeProps } from 'antd'
import { useState } from 'react'
import { RoleService, SysRole } from './role.service'

import { SysMenuService, SysMenuVO, useMenuStore } from '@/core/services/menu.service'
import { OverlayFooter } from '@/shared/components/OverlayFooter'

export const EditAuth = create((props: SysRole) => {
    const sysMenuService = useDependency(SysMenuService)
    const sysRoleService = useDependency(RoleService)
    const [sysMenu, setSysMenu] = useState<SysMenuVO[]>([])
    const drawer = useModal()
    const [menu, setMenu] = useState<React.Key[]>([])

    useMount(() => {
        sysMenuService.listByType(-1, true).then((res) => {
            setSysMenu(res)
        })
        sysRoleService.getMenuIds(props.id).subscribe((res) => {
            setMenu(res.data)
        })
        console.log(sysMenu)
    })
    const onMenuNodeClick: TreeProps['onCheck'] = (checked: any, { checkedNodes }) => {
        // @ts-ignore
        setMenu(
            checkedNodes
                .filter((e) => !(Array.isArray(e.children) && e.children.length > 0))
                // @ts-ignore
                .map((e) => e.id)
        )
    }

    const close = () => {
        drawer.hide()
        drawer.resolve(true)
        setTimeout(() => {
            drawer.remove()
        }, 300)
    }

    const submit = () => {
        sysRoleService.updateRoleMenu(props.id, menu).subscribe(() => {
            drawer.hide()
            drawer.resolve(true)
            setTimeout(() => {
                drawer.remove()
            }, 300)
        })
    }

    return (
        <Drawer title={'编辑权限'} width={500} open={drawer.visible} onClose={close}>
            <Tree
                fieldNames={{
                    key: 'id'
                    // title: 'label'
                    // children: 'children'
                }}
                checkable
                // defaultExpandAll
                blockNode
                onCheck={onMenuNodeClick}
                checkedKeys={menu}
                // showLine={false}
                // showIcon={false}
                // onSelect={onMenuNodeClick}
                treeData={sysMenu as any}
            />
            <OverlayFooter>
                <Button onClick={submit}>提交</Button>
            </OverlayFooter>
        </Drawer>
    )
})
