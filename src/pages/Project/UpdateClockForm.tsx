import { TaskDTO, TasksItem, useTaskService } from '@/core/services/task.service'
import { FileUpload } from '@/shared/components/FileUpload'
import { Button, Input, TextArea, Form } from 'antd-mobile'
import form from 'antd-mobile/es/components/form'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const UpdateClockForm = () => {
    const { id } = useParams()
    const [form] = Form.useForm()

    const taskService = useTaskService()
    const onFinish = (values: any) => {}
    const [task, setTask] = useState<TasksItem>()
    useEffect(() => {
        taskService.getTaskDetail(id || '').subscribe((res) => {
            setTask(res.data)
        })
    }, [])
    return (
        <div>
            <div className="bg-[#eff2fa] min-h-100vh">
                <div className="text-20px p-10px bg-[#fff]">节点打卡</div>
                <div className="m-2">
                    <Form
                        form={form}
                        name="form"
                        style={{ '--border-top': 'none' }}
                        onFinish={onFinish}
                        footer={
                            <div className="flex">
                                <Button block type="submit" color="primary" size="large">
                                    提交
                                </Button>
                            </div>
                        }
                    >
                        <Form.Item label="节点名称">
                            <Input disabled value={task?.name} />
                        </Form.Item>
                        {task?.deliverables.map((e) => {
                            return (
                                <Form.Item label={e.title}>
                                    <FileUpload
                                        accept="*"
                                        maxCount={1}
                                        onChange={(files, response) => {
                                            const filesList = files
                                                .map((file) => file.response?.id)
                                                .filter(Boolean)
                                                .join(',')
                                            form.setFieldValue('attachment', filesList)
                                        }}
                                    />
                                </Form.Item>
                            )
                        })}
                    </Form>
                </div>
            </div>
        </div>
    )
}
