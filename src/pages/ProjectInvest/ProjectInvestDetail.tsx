import {
    ProjectInvestCountDTO,
    ProjectInvestDTO,
    useProjectInvestService
} from '@/core/services/project_invest.service'
import { CellList } from '@/shared/components/cellList'
import { Button, Card, Form, TextArea } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const ProjectInvestDetailView = () => {
    const { id } = useParams()
    const [form] = Form.useForm()
    const projectInvestService = useProjectInvestService()
    const n = useNavigate()
    const [projectInvest, setProjectInvest] = useState<ProjectInvestDTO>()
    const [approvalStatus, setApprovalStatus] = useState('PASS')
    const onFinish = (values: any) => {
        projectInvestService
            .approvalInvest({
                ...values,
                projectId: projectInvest?.projectId,
                id: id,
                approvalStatus: approvalStatus
            })
            .subscribe((res) => {
                n('/project-invest')
            })
    }
    useEffect(() => {
        projectInvestService.getProjectInvestDetail(id || '').subscribe((res) => {
            setProjectInvest(res.data)
        })
    }, [])
    return (
        <div>
            <div className="bg-[#eff2fa] min-h-100vh">
                <div className="text-20px p-10px bg-[#fff]">月报审核</div>
                <div className="m-2">
                    <CellList
                        data={projectInvest}
                        columns={[
                            { title: '项目名称', dataIndex: 'projectName' },
                            {
                                title: '投资年月',
                                dataIndex: 'days'
                            },
                            { title: '形象进度计划', dataIndex: 'imageSchedule' },
                            { title: '形象进度', dataIndex: 'imageProgress	' },
                            { title: '计划投资金额', dataIndex: 'plannedAmount' },
                            { title: '形象投资金额', dataIndex: 'imageAmount' },
                            { title: '财务支付金额', dataIndex: 'imageAmount' },
                            { title: '上传附件', dataIndex: 'imageAmount' }
                        ]}
                    ></CellList>
                    <Form
                        name="form"
                        form={form}
                        style={{ '--border-top': 'none' }}
                        onFinish={onFinish}
                        footer={
                            <div className="flex">
                                <Button
                                    className="mr-2"
                                    block
                                    color="primary"
                                    onClick={() => {
                                        setApprovalStatus('PASS')
                                        form.submit()
                                    }}
                                >
                                    同意
                                </Button>
                                <Button
                                    className="ml-2"
                                    block
                                    color="danger"
                                    onClick={() => {
                                        setApprovalStatus('NOTPASS')
                                        form.submit()
                                    }}
                                >
                                    拒绝
                                </Button>
                            </div>
                        }
                    >
                        <Form.Item
                            name="existingProblem"
                            label="存在问题"
                            rules={[{ required: true }]}
                        >
                            <TextArea placeholder="请输入存在问题" rows={2} />
                        </Form.Item>
                        <Form.Item name="nextPlan" label="下步计划" rules={[{ required: true }]}>
                            <TextArea placeholder="请输入下步计划" rows={2} />
                        </Form.Item>
                        <Form.Item
                            name="approvalDesc"
                            label="审核结果"
                            rules={[{ required: true }]}
                        >
                            <TextArea placeholder="请输审核结果" rows={2} />
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    )
}
