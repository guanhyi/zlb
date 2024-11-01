import { ProTable } from '@ant-design/pro-components'
import { connectDependencies, useDependency } from '@wendellhu/redi/react-bindings'
import { RoleService } from './role.service'

import { Button, Popconfirm, Space } from 'antd'
import { DeleteOutlined, EditOutlined, SettingFilled } from '@ant-design/icons'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { SysMenuService } from '@/core/services/menu.service'
import { DictContainer } from '@/shared/components/sysDictlpt/DictContainer'
import { RoleForm } from './RoleForm'
import { EditAuth } from './EditAuth'
// import { RoleForm } from './RoleForm'
// import { EditAuth } from './EditAuth'

export const RoleView = connectDependencies(() => {
    const roleService = useDependency(RoleService)
    const form = useModal(RoleForm)
    const editAuth = useModal(EditAuth)
    return (
        <NiceModal.Provider>
            <DictContainer code="BOOLEAN_STATUS">
                {(BOOLEAN_STATUS) => (
                    <ProTable
                        toolBarRender={() => [
                            <Button
                                type="primary"
                                onClick={() => {
                                    form.show().then(() => {
                                        roleService.curdTable.reload()
                                    })
                                }}
                            >
                                新增
                            </Button>
                        ]}
                        actionRef={roleService.setCurdTable}
                        rowKey={'id'}
                        request={roleService.proPage}
                        columns={[
                            {
                                title: '角色名称',
                                dataIndex: 'name'
                            },
                            {
                                title: '注释',
                                dataIndex: 'remark',
                                search: false
                            },
                            {
                                title: '状态',
                                dataIndex: 'status',
                                valueEnum: {
                                    1: '启用',
                                    0: '禁用'
                                }
                            },
                            {
                                title: '操作',
                                valueType: 'option',
                                render: (_, record) => {
                                    return (
                                        <Space>
                                            <Button
                                                icon={<SettingFilled />}
                                                size="small"
                                                onClick={() => {
                                                    editAuth.show(record)
                                                }}
                                                title="菜单"
                                            ></Button>
                                            <Button
                                                icon={<EditOutlined />}
                                                size="small"
                                                title="详情"
                                                onClick={() => {
                                                    form.show(record).then(() => {
                                                        roleService.curdTable.reload()
                                                    })
                                                }}
                                            ></Button>
                                            <Popconfirm
                                                title="确定删除?"
                                                onConfirm={() => {
                                                    roleService.delete(record.id).subscribe(() => {
                                                        roleService.curdTable.reload()
                                                    })
                                                }}
                                            >
                                                <Button
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    size="small"
                                                    title="删除"
                                                ></Button>
                                            </Popconfirm>
                                        </Space>
                                    )
                                }
                            }
                        ]}
                    />
                )}
            </DictContainer>
        </NiceModal.Provider>
    )
}, [[RoleService], [SysMenuService]])
