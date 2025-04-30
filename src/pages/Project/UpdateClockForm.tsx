import { TaskDTO, TasksItem, useTaskService } from '@/core/services/task.service'
import { FileUpload } from '@/shared/components/FileUpload'
import { Button, Input, TextArea, Form, Toast } from 'antd-mobile'
import form from 'antd-mobile/es/components/form'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const UpdateClockForm = () => {
    const { id } = useParams()
    const [form] = Form.useForm()

    const taskService = useTaskService()

    const [task, setTask] = useState<TasksItem>()

    useEffect(() => {
        taskService.getTaskDetail(id || '').subscribe((res) => {
            setTask(res.data)
        })
    }, [])
    const navigate = useNavigate()

    const onFinish = (values: any) => {
        console.log(values)

        const formData = {
            deliverables: [] as any,
            id: id
        }

        task?.deliverables.forEach((e, index) => {
            formData.deliverables.push(values[`attachment${index}`])
        })
        taskService.updateClock(formData).subscribe((res) => {
            console.log(res)

            if (res.code === (200 as any)) {
                Toast.show('提交成功')
                navigate(-1)
            } else {
                Toast.show(res.msg)
            }
        })
    }
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
                        {task?.deliverables.map((e, index) => {
                            return (
                                <Form.Item label={e.title} name={`attachment${index}`} key={index}>
                                    <FileUpload
                                        accept="*"
                                        maxCount={1}
                                        onChange={(files, response) => {
                                            const filesList = files
                                                .map((file) => file.response?.id)
                                                .filter(Boolean)
                                                .join(',')
                                            form.setFieldValue(`attachment${index}`, {
                                                ...e,
                                                content: response?.id || '',
                                                isSubmitted: response ? 'True' : 'False'
                                            })
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
