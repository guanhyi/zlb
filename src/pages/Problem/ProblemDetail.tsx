import { ProblemDTO, useProblemService } from '@/core/services/problem.service'
import { CellList } from '@/shared/components/cellList'
import { Show } from '@/shared/components/control/Show'
import { Button, Card, Form, List, Picker, TextArea } from 'antd-mobile'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const ProblemDetailView = () => {
    const { id } = useParams()
    const [visible, setVisible] = useState(false)
    const problemService = useProblemService()
    const [problemDetail, setProblemDetail] = useState<ProblemDTO>()
    const n = useNavigate()
    const resultList = [
        [
            { label: '尚未协调', value: 'NOTYETCOORDINATED' },
            { label: '协调成功', value: 'SUCCEED' },
            { label: '协调失败', value: 'FAILD' }
        ]
    ]
    const [value, setValue] = useState<(string | null)[]>([])
    const [coordinationResultRecord, setCoordinationResultRecord] = useState<string>('')
    const onFinish = (params: any) => {
        problemDetail!.flowList[0].coordinationResult = value[0] || ''
        problemDetail!.flowList[0].coordinationResultRecord = params.coordinationResultRecord

        problemService.updateCoordination(problemDetail!.flowList[0]).subscribe((res) => {
            n('/problem')
        })
    }
    useEffect(() => {
        problemService.getProblemDetail(id || '').subscribe((res) => {
            setProblemDetail(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">问题协调</div>
            <div className="m-2">
                <CellList
                    data={problemDetail}
                    columns={[
                        { title: '项目名称', dataIndex: 'projectName' },
                        {
                            title: '节点名称',
                            dataIndex: '',
                            render: <div>{problemDetail?.flowList[0].flowName}</div>
                        },
                        { title: '申报内容', dataIndex: 'declarationContent' },
                        { title: '申报单位', dataIndex: 'declarationOrgName' },
                        {
                            title: '协调人',
                            dataIndex: '',
                            render: <div>{problemDetail?.flowList[0].coordinatorName}</div>
                        }
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
                        onClick={() => {
                            setVisible(true)
                        }}
                        name="coordinationResult"
                        label="协调结果"
                    >
                        <Picker
                            columns={resultList}
                            visible={visible}
                            onClose={() => {
                                setVisible(false)
                            }}
                            value={value}
                            onConfirm={(v: any) => {
                                setValue(v)
                            }}
                        >
                            {(items, { open }) => {
                                return <div>{items[0]?.label}</div>
                            }}
                        </Picker>
                    </Form.Item>
                    <Form.Item
                        name="coordinationResultRecord"
                        label="协调记录"
                        rules={[{ required: true }]}
                    >
                        <TextArea placeholder="请输入协调记录" rows={2} />
                    </Form.Item>
                </Form>
                {/* <div className="mt-4">
                <Button
                    onClick={() => {
                        submit(problemDetail)
                    }}
                    block
                    color="primary"
                >
                    提交
                </Button>
            </div> */}
            </div>
        </div>
    )
}
