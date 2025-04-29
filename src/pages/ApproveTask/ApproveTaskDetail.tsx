import { TaskDTO, TasksItem, useTaskService } from '@/core/services/task.service'
import { CellList } from '@/shared/components/cellList'
import { Button, Form, TextArea } from 'antd-mobile'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const ApproveTaskDetailView = () => {
    const { id } = useParams()
    const [form] = Form.useForm()
    const taskService = useTaskService()
    const [taskDetail, setTaskDetail] = useState<TasksItem>()
    const n = useNavigate()
    const agree = async () => {
        try {
            const values = await form.validateFields()
            // 表单验证通过，可以进行后续操作
            taskService
                .approvalCompleteTask({
                    id: taskDetail?.id,
                    ...values,
                    completeApprovalStatus: 'PASS',
                    endTime: dayjs(taskDetail?.endTime).format('YYYY-MM-DD 23:59:59')
                })
                .subscribe((res) => {
                    if (res.data) {
                        n('/approve-task')
                    }
                })
            // TODO: 调用同意接口
        } catch (errorInfo) {
            // 表单验证失败
            console.log('验证失败:', errorInfo)
        }
    }

    const notPass = async () => {
        try {
            const values = await form.validateFields()
            // 表单验证通过，可以进行后续操作
            taskService
                .approvalCompleteTask({
                    id: taskDetail?.id,
                    ...values,
                    completeApprovalStatus: 'NOTPASS',
                    endTime: dayjs(taskDetail?.endTime).format('YYYY-MM-DD HH:ss')
                })
                .subscribe((res) => {
                    if (res.data) {
                        n('/approve-task')
                    }
                })
            // TODO: 调用同意接口
        } catch (errorInfo) {
            // 表单验证失败
            console.log('验证失败:', errorInfo)
        }
    }
    useEffect(() => {
        taskService.getTaskDetail(id || '').subscribe((res) => {
            setTaskDetail(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">节点审核</div>
            <div className="m-2">
                <CellList
                    data={taskDetail}
                    columns={[
                        { title: '项目名称', dataIndex: 'projectName' },
                        {
                            title: '节点名称',
                            dataIndex: 'name'
                        },
                        { title: '事项名称及编码', dataIndex: 'eventCode' },
                        { title: '父级节点', dataIndex: 'parentName' },
                        { title: '项目阶段', dataIndex: 'stageName' },
                        { title: '节点责任单位', dataIndex: 'governingOrg' },
                        { title: '部门分管领导', dataIndex: 'inChargeMemberName' },
                        { title: '节点责任人', dataIndex: 'personLiableName' },
                        { title: '办理时限', dataIndex: 'deadline' },
                        {
                            title: '节点开始时间',
                            dataIndex: 'startTime',
                            render: (
                                <div>
                                    {taskDetail?.startTime
                                        ? dayjs(taskDetail?.startTime).format('YYYY-MM-DD HH:ss')
                                        : '-'}
                                </div>
                            )
                        },
                        {
                            title: '节点截止时间',
                            dataIndex: 'endTime',
                            render: (
                                <div>
                                    {taskDetail?.endTime
                                        ? dayjs(taskDetail?.endTime).format('YYYY-MM-DD HH:ss')
                                        : '-'}
                                </div>
                            )
                        },
                        {
                            title: '临近提醒时间',
                            dataIndex: 'reminderTimeFormat',
                            render: (
                                <div>
                                    {taskDetail?.reminderTimeFormat
                                        ? dayjs(taskDetail?.reminderTimeFormat).format(
                                              'YYYY-MM-DD HH:ss'
                                          )
                                        : '-'}
                                </div>
                            )
                        },
                        {
                            title: '超时预警时间',
                            dataIndex: 'warningTimeFormat',
                            render: (
                                <div>
                                    {taskDetail?.warningTimeFormat
                                        ? dayjs(taskDetail?.warningTimeFormat).format(
                                              'YYYY-MM-DD HH:ss'
                                          )
                                        : ''}
                                </div>
                            )
                        },
                        { title: '节点状态', dataIndex: 'statusName' },
                        { title: '节点结果材料', dataIndex: 'declarationContent' }
                    ]}
                ></CellList>
                <Form
                    className="mt-1"
                    name="form"
                    form={form}
                    style={{ '--border-top': 'none' }}
                    footer={
                        <div className="flex">
                            <Button
                                className="mr-2"
                                block
                                onClick={() => {
                                    agree()
                                }}
                                color="primary"
                                size="large"
                            >
                                同意
                            </Button>
                            <Button
                                className="mr-2"
                                block
                                onClick={() => {
                                    notPass()
                                }}
                                color="danger"
                                size="large"
                            >
                                拒绝
                            </Button>
                        </div>
                    }
                >
                    <Form.Item name="approvalResults" label="审核记录" rules={[{ required: true }]}>
                        <TextArea placeholder="请输入审核记录" rows={2} />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
