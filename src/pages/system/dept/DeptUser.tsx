import { SysMenuService } from '@/core/services/menu.service'
import { SysDeptService, SysDeptVO } from '@/core/services/system/SysDeptService'
import { SysUserService, SysUserVO } from '@/core/services/system/SysUserService'
import { connectDependencies, useDependency } from '@wendellhu/redi/react-bindings'
import { RoleService } from '../role/role.service'
import { useState } from 'react'
import { PageContainer, ProCard, ProColumns, ProTable } from '@ant-design/pro-components'
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Space, Button, Popconfirm, Tree, Table, Card, Drawer } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useMount } from 'ahooks'
import NiceModal, { create, useModal } from '@ebay/nice-modal-react'
import { Scrollbar } from '@/shared/components/Scrollbar'
import { Show } from '@/shared/components/control/Show'
import { UserEdit } from '../user/UserEdit'
import { useModalRef } from '@/shared/hooks/useModalRef'

export const DeptUserTable = create(
    connectDependencies(
        ({ deptId, deptName }: { deptId: string; deptName: string }) => {
            const sysDeptService = useDependency(SysDeptService)
            const sysUserService = useDependency(SysUserService)
            const [userPage, setUserPage] = useState<PageRes<SysUserVO[]>>()
            const drawerRef = useModalRef()
            const [mobile, setMobile] = useState('')
            const [username, setUsername] = useState('')
            const [realName, setRealName] = useState('')
            const userForm = useModal(UserEdit)
            const UserColumns: ProColumns<SysUserVO, 'text'>[] = [
                {
                    dataIndex: 'username',
                    title: '登录账号'
                },
                {
                    dataIndex: 'realName',
                    title: '姓名'
                },
                {
                    dataIndex: 'mobile',
                    title: '电话'
                },
                {
                    dataIndex: 'deptName',
                    title: '部门',
                    search: false
                },
                // {
                //     dataIndex: 'deptId',
                //     hideInTable: true,
                //     valueType: 'treeSelect',
                //     fieldProps: {
                //         key: 'id',
                //         fieldNames: {
                //             label: 'name',
                //             value: 'id'
                //         },
                //         // showSearch: true,
                //         treeData: sysDeptService.Depts.value
                //     },
                //     title: '部门'
                //     // search: false
                // },
                {
                    dataIndex: 'createTime',
                    title: '加入时间',
                    valueType: 'date'
                },
                {
                    dataIndex: 'xx2',
                    width: 150,
                    align: 'center',
                    title: '操作',
                    search: false,
                    render: (_v, record, _, action) => {
                        return (
                            <Space>
                                {/* <Button
                        type="primary"
                        icon={<SettingFilled />}
                        size="small"
                        onClick={() => {
                            editAuth.show()
                        }}
                        title="菜单"
                    ></Button> */}
                                <Button
                                    icon={<EditOutlined />}
                                    size="small"
                                    title="详情"
                                    onClick={() => {
                                        userForm
                                            .show({
                                                userid: record.id
                                            })
                                            .then((res) => {
                                                // getPage(1)
                                                action?.reload()
                                            })
                                    }}
                                ></Button>
                                <Popconfirm
                                    title="是否删除该用户?"
                                    description="删除将无法恢复"
                                    onConfirm={(e) => {
                                        e?.stopPropagation()
                                        sysUserService.delete(record.id).subscribe(() => {
                                            action?.reload()
                                            // getPage()
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
            ]

            const getPage = (
                pageNo = 1,
                pageSize = 10,
                deptId?: any,
                mobile?: any,
                username?: any,
                realName?: any
            ) => {
                sysUserService
                    .page({
                        pageNo: pageNo,
                        pageSize: pageSize,
                        deptId,
                        mobile,
                        username,
                        keyword: realName
                    })
                    .subscribe((res) => {
                        setUserPage(res.data)
                    })
            }
            useMount(() => {
                // getPage()
                sysDeptService.listBy()
            })

            return (
                <Drawer
                    title={deptName + '部门成员'}
                    width={1000}
                    open={drawerRef.visible}
                    onClose={() => {
                        console.log(11)
                        drawerRef.hide()
                        drawerRef.resolve(true)
                        setTimeout(() => {
                            drawerRef.remove()
                        }, 300)
                    }}
                >
                    <Card
                        extra={
                            <Button
                                type="primary"
                                onClick={() =>
                                    userForm.show().then(() => {
                                        sysUserService.curdTable.reload()
                                    })
                                }
                            >
                                新增
                            </Button>
                        }
                    >
                        <ProTable
                            params={{
                                deptId
                            }}
                            // loading={sysUserService.requestLoading.loading.value}
                            // className="p-[10px]"
                            // pagination={{
                            //     total: userPage?.total,
                            //     current: +(userPage?.current || 1),
                            //     pageSize: userPage?.size,
                            //     onChange: (page, pageSize) => {
                            //         getPage(page, pageSize, deptId)
                            //     }
                            // }}
                            actionRef={sysUserService.setCurdTable}
                            request={sysUserService.proPage}
                            key="id"
                            rowKey="id"
                            // dataSource={userPage?.records || []}
                            size="small"
                            columns={UserColumns}
                        />
                    </Card>
                </Drawer>
            )
        },
        [[SysDeptService], [SysUserService], [SysMenuService], [RoleService]]
    )
)
