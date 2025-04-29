import { useCommentsService } from '@/core/services/comments.service'
import { ProblemDTO, useProblemService } from '@/core/services/problem.service'
import { ProjectDTO, useProjectService } from '@/core/services/project.service'
import { CellList } from '@/shared/components/cellList'
import { Show } from '@/shared/components/control/Show'
import { OrgPicker, OrgRef } from '@/shared/components/OrgPicker'
import { UserByOrgId } from '@/shared/components/UserByOrgId'
import { Button, Card, Form, List, Picker, TextArea } from 'antd-mobile'
import { ReactNode, RefObject, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const SuperviseProjectView = () => {
    const { id } = useParams()
    const [visible, setVisible] = useState(false)
    const projectService = useProjectService()
    const commentsService = useCommentsService()
    const [projectDetail, setProjectDetail] = useState<ProjectDTO>()
    const resultList = [
        [
            { label: '尚未协调', value: 'NOTYETCOORDINATED' },
            { label: '协调成功', value: 'SUCCEED' },
            { label: '协调失败', value: 'FAILD' }
        ]
    ]
    const n = useNavigate()
    const onFinish = (params: any) => {
        const form = {
            type: 'Instructions',
            instructionsTo: 'Project',
            projectId: projectDetail?.id,
            responsibleLeaderList: [params.responsibleLeaderList],
            responsibleOrgList: [params.responsibleOrgList],
            toOrgList: [params.toOrgList]
        }
        commentsService.createComments(form).subscribe((res) => {
            if (res.data) {
                n('/project')
            }
        })

        console.log(form)
    }
    useEffect(() => {
        projectService.getProjectDetail(id || '').subscribe((res) => {
            setProjectDetail(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">批示督办</div>
            <div className="m-2">
                <CellList
                    data={projectDetail}
                    columns={[
                        { title: '项目名称', dataIndex: 'name' },
                        { title: '类型', dataIndex: 'indication' }
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
                        onClick={(e, datePickerRef: RefObject<OrgRef>) => {
                            datePickerRef.current?.open()
                        }}
                        name="responsibleOrgList"
                        label="交办单位"
                        rules={[{ required: true }]}
                    >
                        <OrgPicker></OrgPicker>
                    </Form.Item>
                    <Form.Item
                        onClick={(e, datePickerRef: RefObject<OrgRef>) => {
                            datePickerRef.current?.open()
                        }}
                        name="toOrgList"
                        label="抄送单位"
                    >
                        <OrgPicker multiple></OrgPicker>
                    </Form.Item>
                    <Form.Item
                        onClick={(e, datePickerRef: RefObject<OrgRef>) => {
                            datePickerRef.current?.open()
                        }}
                        name="responsibleLeaderList"
                        label="交办领导"
                    >
                        <UserByOrgId orgId="1667806006582247425"></UserByOrgId>
                    </Form.Item>
                    <Form.Item
                        name="instructionsContent"
                        label="内容描述"
                        rules={[{ required: true }]}
                    >
                        <TextArea placeholder="请输入内容描述" rows={7} />
                    </Form.Item>
                </Form>
                {/* <div className="mt-4">
                    <Button onClick={() => {}} block color="primary">
                        提交
                    </Button>
                </div> */}
            </div>
        </div>
    )
}
