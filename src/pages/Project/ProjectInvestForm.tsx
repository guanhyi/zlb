import {
    useProjectInvestService,
    ProjectInvestCountDTO,
    ProjectInvestDTO
} from '@/core/services/project_invest.service'
import { FileUpload } from '@/shared/components/FileUpload'
import { Button, Form, Input, Stepper, TextArea } from 'antd-mobile'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { array } from 'zod'

export const ProjectInvestForm = () => {
    const [form] = Form.useForm()
    const { id } = useParams()

    const projectInvestService = useProjectInvestService()
    const [projectInvest, setProjectInvest] = useState<ProjectInvestDTO>()
    const onFinish = (values: any) => {
        values.imageAmount = Number(values.imageAmount)
        projectInvestService
            .updateProjectInvest({
                days: projectInvest?.days,
                projectId: projectInvest?.projectId,
                id: projectInvest?.id,
                ...values
            })
            .subscribe()
    }
    useEffect(() => {
        projectInvestService.getProjectInvestDetail(id || '').subscribe((res) => {
            setProjectInvest(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">月报填报</div>
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
                    <Form.Item label="投资年月">
                        <Input disabled value={projectInvest?.days} />
                    </Form.Item>
                    <Form.Item name="imageSchedule" label="形象进度" rules={[{ required: true }]}>
                        <TextArea placeholder="请输入形象进度" rows={2} />
                    </Form.Item>
                    <Form.Item name="existingProblem" label="存在问题">
                        <TextArea placeholder="请输入存在问题" rows={2} />
                    </Form.Item>
                    <Form.Item name="nextPlan" label="下步计划">
                        <TextArea placeholder="请输入下步计划" rows={2} />
                    </Form.Item>
                    <Form.Item name="imageAmount" label="形象投资金额" rules={[{ required: true }]}>
                        <Input
                            type="number"
                            placeholder="请输入形象投资金额"
                            value={projectInvest?.days}
                        />
                    </Form.Item>
                    <Form.Item name="attachment" label="附件上传">
                        <FileUpload
                            accept="*"
                            maxCount={5}
                            onChange={(files, response) => {
                                const filesList = files
                                    .map((file) => file.response?.id)
                                    .filter(Boolean)
                                    .join(',')
                                form.setFieldValue('attachment', filesList)
                            }}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
