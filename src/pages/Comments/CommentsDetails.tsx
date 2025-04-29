import { CommentsDTO, useCommentsService } from '@/core/services/comments.service'
import { CellList } from '@/shared/components/cellList'
import { Button, Card, Form, TextArea, Toast } from 'antd-mobile'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export const CommentsDetailsView = () => {
    const { id } = useParams()
    const commentsService = useCommentsService()
    const [commentsDetails, setCommentsDetails] = useState<CommentsDTO>()
    const n = useNavigate()
    const onFinish = (params: any) => {
        const form = {
            ...commentsDetails?.feedBackList[0],
            feedbackContent: params.feedbackContent,
            state: 'AlreadyFeedback'
        }
        commentsService.feedback({ ...form }).subscribe((res) => {
            if (res.data) {
                n('/comments')
            } else {
                Toast.show({
                    content: res.msg,
                    afterClose: () => {
                        console.log('after')
                    }
                })
            }
        })
    }
    useEffect(() => {
        commentsService.getDetails(id || '').subscribe((res) => {
            setCommentsDetails(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">批示督办</div>
            <div className="m-2">
                <CellList
                    data={commentsDetails}
                    columns={[
                        { title: '项目名称', dataIndex: 'projectName' },
                        { title: '节点名称', dataIndex: 'stateName' },
                        { title: '类型', dataIndex: 'typeName' },
                        { title: '内容描述', dataIndex: 'instructionsContent' },
                        { title: '批示督办领导', dataIndex: 'leaderName' },
                        { title: '批示督办时间', dataIndex: 'instructionsTime' },
                        { title: '交办单位', dataIndex: 'toOrgName' },
                        {
                            title: '反馈汇报',
                            dataIndex: '',
                            render: <div>{commentsDetails?.feedBackList[0].feedbackContent}</div>
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
                    <Form.Item name="feedbackContent" label="反馈记录" rules={[{ required: true }]}>
                        <TextArea placeholder="请输入反馈记录" rows={2} />
                    </Form.Item>
                </Form>
            </div>
            {/* <div className="pt-4">
                <Card className="mx-4 text-15px" title="批示督办详情">
                    <div className="flex my-2">
                        <div>项目名称：</div>
                        <div>{commentsDetails?.projectName}</div>
                    </div>
                    <div className="flex my-2">
                        <div>节点名称：</div>
                        <div>{commentsDetails?.stateName}</div>
                    </div>
                    <div className="flex my-2">
                        <div>类型：</div>
                        <div>{commentsDetails?.typeName}</div>
                    </div>
                    <div className="flex my-2">
                        <div>内容描述：</div>
                        <div>{commentsDetails?.instructionsContent}</div>
                    </div>
                    <div className="flex my-2">
                        <div>批示督办领导：</div>
                        <div>{commentsDetails?.leaderName}</div>
                    </div>
                    <div className="flex my-2">
                        <div>批示督办时间：</div>
                        <div>{commentsDetails?.instructionsTime}</div>
                    </div>
                    <div className="flex my-2">
                        <div>交办单位：</div>
                        <div>{commentsDetails?.toOrgName}</div>
                    </div>
                    <div className="flex my-2">
                        <div>反馈汇报：</div>
                        <div>{commentsDetails?.feedBackList[0].feedbackContent}</div>
                    </div>
                </Card>
            </div> */}
        </div>
    )
}
