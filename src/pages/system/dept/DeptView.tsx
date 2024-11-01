import { SysDeptService, SysDeptVO } from '@/core/services/system/SysDeptService'
import { Scrollbar } from '@/shared/components/Scrollbar'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { useMount } from 'ahooks'
import { Button, Card, Flex, Popconfirm, Table } from 'antd'
import { DeptEdit } from './DeptEdit'
import { Show } from '@/shared/components/control/Show'
import { DeleteOutlined, EditOutlined, PlusOutlined, UserSwitchOutlined } from '@ant-design/icons'
import { DeptChart } from './DeptChart'
import { DeptUserTable } from './DeptUser'

export const DeptView = () => {
    const sysDeptService = useDependency(SysDeptService)
    const deptEdit = useModal(DeptEdit)
    const deptUser = useModal(DeptUserTable)
    useMount(() => {
        sysDeptService.listBy()
    })

    const onDeptDelete = (p: SysDeptVO) => {
        sysDeptService.delete(p.id).subscribe(() => {
            sysDeptService.listBy(true)
        })
    }

    return (
        <NiceModal.Provider>
            <Card
                title="部门管理"
                extra={
                    <Button
                        type="primary"
                        onClick={() => {
                            deptEdit.show({
                                id: '0',
                                isAdd: true
                            })
                        }}
                    >
                        新增
                    </Button>
                }
            >
                <Scrollbar style={{ height: 'calc(100vh - 400px)' }}>
                    <Table<SysDeptVO>
                        dataSource={sysDeptService.Depts.value}
                        rowKey={'id'}
                        columns={[
                            {
                                title: '部门名称',
                                dataIndex: 'name'
                            },
                            {
                                title: '备注',
                                dataIndex: 'remark'
                            },
                            {
                                title: '操作',
                                key: 'operation',
                                render: (_, record) => (
                                    <Flex gap="middle" wrap className=" text-gray">
                                        <Button
                                            icon={<UserSwitchOutlined />}
                                            onClick={() => {
                                                deptUser
                                                    .show({
                                                        deptId: record.id,
                                                        deptName: record.name
                                                    })
                                                    .then()
                                            }}
                                        />

                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                deptEdit
                                                    .show({
                                                        ...record,
                                                        isAdd: true
                                                    })
                                                    .then(() => {
                                                        sysDeptService.listBy()
                                                    })
                                                // onAdd(p)
                                            }}
                                            className=" text-center"
                                            icon={<PlusOutlined />}
                                        ></Button>

                                        <Button
                                            onClick={() => {
                                                deptEdit
                                                    .show({ ...record, isAdd: false })
                                                    .then(() => {
                                                        sysDeptService.listBy()
                                                    })
                                            }}
                                            icon={<EditOutlined />}
                                        ></Button>
                                        <Show
                                            when={!record.children || record.children.length === 0}
                                        >
                                            <Popconfirm
                                                title="是否删除该部门?"
                                                description="删除将无法恢复"
                                                onConfirm={(e) => {
                                                    e?.stopPropagation()
                                                    onDeptDelete(record)
                                                    // onDelete(p)
                                                }}
                                                // onCancel={cancel}
                                            >
                                                <Button danger icon={<DeleteOutlined />} />
                                            </Popconfirm>
                                        </Show>
                                    </Flex>
                                )
                                // valueType: "option",
                            }
                        ]}
                        pagination={false}
                    />
                </Scrollbar>
            </Card>

            <Card title="部门图" className="mt-4">
                <Scrollbar style={{ height: 'calc(100vh - 500px)' }}>
                    <DeptChart />
                </Scrollbar>
            </Card>
        </NiceModal.Provider>
    )
}
