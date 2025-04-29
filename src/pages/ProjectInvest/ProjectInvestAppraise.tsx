import {
    ProjectInvestCountDTO,
    useProjectInvestService
} from '@/core/services/project_invest.service'
import { CellList } from '@/shared/components/cellList'
import { DictPicker, DictRef } from '@/shared/components/DictPicker'
import { Button, Card, Form, TextArea } from 'antd-mobile'
import { RefObject, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const ProjectInvestAppraiseView = () => {
    const { id } = useParams()

    const projectInvestService = useProjectInvestService()
    const [projectInvest, setProjectInvest] = useState<ProjectInvestCountDTO>()
    const onFinish = (values: any) => {
        console.log(values)
    }
    useEffect(() => {
        projectInvestService.getProjectInvestDetail(id || '').subscribe((res) => {
            setProjectInvest(res.data)
        })
    }, [])
    return (
        <div>
            <div className="p-4">
                <div className="text-20px p-10px bg-[#fff]">月报审核</div>

                <CellList
                    data={projectInvest}
                    columns={[
                        { title: '项目名称', dataIndex: 'projectName' },
                        {
                            title: '主管责任单位',
                            dataIndex: 'days'
                        },
                        { title: '月报时间', dataIndex: 'imageSchedule' },
                        { title: '机评', dataIndex: 'imageProgress	' },
                        { title: '机评依据', dataIndex: 'plannedAmount' }
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
                        onClick={(e, datePickerRef: RefObject<DictRef>) => {
                            datePickerRef.current?.open()
                        }}
                        name="existingProblem"
                        label="评价"
                        rules={[{ required: true }]}
                    >
                        <DictPicker module="project_exception"></DictPicker>
                    </Form.Item>
                    <Form.Item name="nextPlan" label="评价描述" rules={[{ required: true }]}>
                        <TextArea placeholder="请输入评价描述" rows={2} />
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
