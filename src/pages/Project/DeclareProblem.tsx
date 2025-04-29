import { ProblemDTO, useProblemService } from '@/core/services/problem.service'
import { ProjectDTO, useProjectService } from '@/core/services/project.service'
import { CellList } from '@/shared/components/cellList'
import { Show } from '@/shared/components/control/Show'
import { Button, Card, Form, List, Picker, TextArea } from 'antd-mobile'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const DeclareProblem = () => {
    const { id } = useParams()
    const projectService = useProjectService()
    const problemService = useProblemService()
    const [projectDetail, setProjectDetail] = useState<ProjectDTO>()
    const n = useNavigate()
    const onFinish = (params: any) => {
        const form = {
            declarationContent: params.declarationContent,
            projectId: projectDetail?.id,
            problemCoordinationFlowCreateDTO: { coordinator: projectDetail?.inChargeMember }
        }
        console.log(projectDetail)
        problemService.createProblem(form).subscribe((res) => {
            if (res.data) {
                n('/project')
            }
        })
    }
    useEffect(() => {
        projectService.getProjectDetail(id || '').subscribe((res) => {
            setProjectDetail(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">问题申报</div>
            <div className="m-2">
                <CellList
                    data={projectDetail}
                    columns={[
                        { title: '项目名称', dataIndex: 'name' },
                        { title: '协调人', dataIndex: 'contactsName' }
                    ]}
                ></CellList>
                <Form
                    className="mt-1"
                    name="form"
                    onFinish={onFinish}
                    style={{ '--border-top': 'none' }}
                    footer={
                        <div className="flex">
                            <Button
                                className="mr-2"
                                block
                                type="submit"
                                color="primary"
                                size="large"
                            >
                                提交
                            </Button>
                        </div>
                    }
                >
                    <Form.Item
                        name="declarationContent"
                        label="申报内容"
                        rules={[{ required: true }]}
                    >
                        <TextArea placeholder="请输入申报内容" rows={2} />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
