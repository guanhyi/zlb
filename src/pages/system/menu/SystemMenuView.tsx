import { SysMenuService, SysMenuVO } from '@/core/services/menu.service'
import IconButton from '@/shared/components/IconButton'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { connectDependencies, useDependency } from '@wendellhu/redi/react-bindings'

import { useMount } from 'ahooks'
import { Button, Card, Flex, Popconfirm, Table, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { MenuForm } from './MenuForm'

export const SystemMenuView = connectDependencies(() => {
    const sysMenuService = useDependency(SysMenuService)
    const menuFormModal = useModal(MenuForm)
    const [menus, setMenus] = useState<SysMenuVO[]>([])
    useMount(() => {
        loadData()
    })

    const loadData = () => {
        sysMenuService.listByType(4).then((res) => {
            setMenus(sysMenuService.removeNullChild(res))
        })
    }

    const addItem = (item: Partial<SysMenuVO> = { pid: '0' }) => {
        menuFormModal.show({ item: { pid: item.id as any } }).then(() => {
            loadData()
        })
    }
    const editItem = (item: Partial<SysMenuVO> = {}) => {
        menuFormModal.show({ item }).then(() => {
            loadData()
        })
    }
    const onDelete = (p: SysMenuVO) => {
        if (!p.children) {
            sysMenuService.did(p.id).subscribe(() => {
                message.success('删除成功')
                loadData()
            })
        } else {
            message.error('请先删除子菜单')
        }
    }

    const columns: ColumnsType<SysMenuVO> = [
        {
            title: '菜单名称',
            dataIndex: 'title',
            width: 300,
            key: 'title'
        },
        {
            title: '菜单路径',
            dataIndex: 'path',
            key: 'path',
            width: 120
        },
        {
            title: '操作',
            key: 'operation',
            align: 'center',
            width: 60,
            render: (_, record) => (
                <Flex gap="middle" wrap className=" text-gray">
                    <Button
                        onClick={() => {
                            addItem(record)
                        }}
                        icon={<PlusCircleOutlined />}
                    />
                    <Button onClick={() => editItem(record)} icon={<EditOutlined />} />
                    <Popconfirm title="确定删除吗?" onConfirm={() => onDelete(record)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Flex>
            )
        }
    ]

    return (
        <NiceModal.Provider>
            <Card
                title="系统菜单"
                extra={
                    <Button type="primary" onClick={() => addItem()}>
                        新增
                    </Button>
                }
            >
                <Table
                    loading={sysMenuService.tableLoading.loading.value}
                    rowKey="id"
                    size="small"
                    scroll={{ x: 'max-content' }}
                    pagination={false}
                    dataSource={menus}
                    columns={columns}
                />
            </Card>
        </NiceModal.Provider>
    )
}, [[SysMenuService]])
