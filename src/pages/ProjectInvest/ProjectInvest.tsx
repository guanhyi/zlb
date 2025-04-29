import { useAuthStore } from '@/core/services/auth.service'
import { ProjectDTO, useProjectService } from '@/core/services/project.service'
import { useProjectFavoriteService } from '@/core/services/project_favorite.service'
import {
    ProjectInvest,
    ProjectInvestCountDTO,
    useProjectInvestService
} from '@/core/services/project_invest.service'
import { CellList } from '@/shared/components/cellList'
import { OrgRef, OrgPicker } from '@/shared/components/OrgPicker'
import { PageList } from '@/shared/components/PageList'
import {
    Badge,
    Button,
    DatePicker,
    DatePickerRef,
    Form,
    Input,
    Loading,
    Popup,
    Selector,
    SideBar,
    SpinLoading,
    Tabs,
    Tag,
    Toast
} from 'antd-mobile'
import dayjs from 'dayjs'
import { RefObject, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FilterImg from '@/assets/filter.png'
import { Show } from '@/shared/components/control/Show'
import styled from 'styled-components'
export const tabs = [
    {
        key: 'key1',
        title: '月报状态'
    },
    {
        key: 'key2',
        title: '项目分类'
    }
]
export const ProjectInvestView = () => {
    const Container = styled.div`
        min-height: 50vh;
        background-color: #ffffff;
        display: flex;
        justify-content: flex-start;
        align-items: stretch;
        [data-prefers-color='dark'] & {
            background-color: unset;
        }
    `
    const Side = styled.div`
        flex: none;
    `

    const Main = styled.div`
        flex: auto;
    `

    const projectInvestService = useProjectInvestService()

    const { user } = useAuthStore()
    const [tabList, setTabList] = useState([
        { title: '全部' },
        { title: '领办' },
        { title: '关注' },
        { title: '我的' },
        { title: '部门' },
        { title: '乡镇' }
    ])

    const n = useNavigate()
    const location = useLocation()

    const { state } = location

    const [projectApprovalCount, setProjectApprovalCount] = useState<ProjectInvestCountDTO>()
    const [searchParams, setSearchParams] = useState()
    const [visible, setVisible] = useState(false)
    const [activeKey, setActiveKey] = useState('key1')
    const [selectedProjectClassify, setSelectedProjectClassify] = useState('')
    const [selectedApprovalStatus, setSelectedApprovalStatus] = useState('')

    const search = (params: any) => {
        setSearchParams({
            ...{
                approvalStatus: selectedApprovalStatus || null,
                classify: selectedProjectClassify || null
            },
            ...params
        })
    }
    const [isStateReady, setIsStateReady] = useState(false)
    useEffect(() => {
        console.log(state)

        if (state) {
            setSelectedApprovalStatus(state?.type)
            search({ approvalStatus: state?.type })
            setTimeout(() => {
                setIsStateReady(true)
            }, 300)
        } else {
            setIsStateReady(true)
        }
    }, [state])
    useEffect(() => {
        projectInvestService.getPagedApprovalCount({ days: '' }).subscribe((res) => {
            setProjectApprovalCount(res.data)
        })
    }, [1])
    return (
        <div className=" bg-[#eff2fa] min-h-100vh">
            <div className="bg-#fff px-20px py-10px text-20px">月报审核</div>
            <div className="px-20px pb-10px flex justify-between bg-#fff">
                <Badge color="#00b678" content={projectApprovalCount?.fasterProjects}>
                    <Tag color="success">超前项目数</Tag>
                </Badge>
                <Badge color="#1677ff" content={projectApprovalCount?.normal}>
                    <Tag color="primary">正常项目数</Tag>
                </Badge>
                <Badge color="#ff8f1f" content={projectApprovalCount?.warning}>
                    <Tag color="warning">预警项目数</Tag>
                </Badge>
                <Badge content={projectApprovalCount?.lagging}>
                    <Tag color="danger">滞后项目数</Tag>
                </Badge>
            </div>
            <Form
                layout="horizontal"
                onFinish={search}
                footer={
                    <div className="flex items-center justify-center">
                        <div className="flex flex-1 mr-2">
                            <Button block type="submit" color="primary">
                                提交
                            </Button>
                        </div>
                        <div
                            onClick={() => {
                                setVisible(true)
                            }}
                        >
                            <img className="w-20px" src={FilterImg} alt="" />
                            <div>筛选</div>
                        </div>
                    </div>
                }
            >
                <Form.Item name="projectName" label="项目名称">
                    <Input placeholder="请输入项目名称" />
                </Form.Item>
                <Form.Item
                    name="affiliationYear"
                    label="年月"
                    trigger="onConfirm"
                    onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                        datePickerRef.current?.open()
                    }}
                >
                    <DatePicker precision="month">
                        {(value) => (value ? dayjs(value).format('YYYY-MM') : '请选择年月')}
                    </DatePicker>
                </Form.Item>
                <Form.Item
                    onClick={(e, datePickerRef: RefObject<OrgRef>) => {
                        datePickerRef.current?.open()
                    }}
                    name="governingOrg"
                    label="主管责任单位"
                >
                    <OrgPicker></OrgPicker>
                </Form.Item>
            </Form>
            <Popup
                visible={visible}
                onMaskClick={() => {
                    setVisible(false)
                }}
                onClose={() => {
                    setVisible(false)
                }}
                showCloseButton
                bodyStyle={{
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    minHeight: '40vh'
                }}
            >
                <Container>
                    <Side>
                        <SideBar activeKey={activeKey} onChange={setActiveKey}>
                            {tabs.map((item) => (
                                <SideBar.Item key={item.key} title={item.title} />
                            ))}
                        </SideBar>
                    </Side>
                    <Main className="pt-35px px-20px">
                        <Show when={activeKey === 'key1'}>
                            <Selector
                                options={[
                                    { label: '新建', value: 'NEWBUILT' },
                                    { label: '未通过', value: 'NOTPASS' },
                                    { label: '已通过', value: 'PASS' },
                                    { label: '待审核', value: 'TOBEREVIEWED' }
                                ]}
                                style={{
                                    '--border': 'solid transparent 1px',
                                    '--checked-border': 'solid var(--adm-color-primary) 1px',
                                    '--padding': '2px 4px'
                                }}
                                columns={2}
                                value={[selectedApprovalStatus]}
                                onChange={(arr) => {
                                    setSelectedApprovalStatus(arr[0])
                                }}
                            />
                        </Show>
                        <Show when={activeKey === 'key2'}>
                            <Selector
                                options={[
                                    { label: '前期项目', value: 'KEYPOINT' },
                                    { label: '重点项目', value: 'PROPHASE' }
                                ]}
                                style={{
                                    '--border': 'solid transparent 1px',
                                    '--checked-border': 'solid var(--adm-color-primary) 1px',
                                    '--padding': '2px 4px'
                                }}
                                columns={2}
                                value={[selectedProjectClassify]}
                                onChange={(arr) => {
                                    setSelectedProjectClassify(arr[0])
                                }}
                            />
                        </Show>
                    </Main>
                </Container>
                <div className="flex p-10px">
                    <Button className="mr-2" block onClick={() => {}}>
                        清除
                    </Button>
                    <Button
                        className="ml-2"
                        block
                        color="primary"
                        onClick={() => {
                            search({
                                approvalStatus: selectedApprovalStatus || null,
                                classify: selectedProjectClassify || null
                            })
                            setVisible(false)
                        }}
                    >
                        查询
                    </Button>
                </div>
            </Popup>
            <PageList
                className="h-100vh"
                params={searchParams}
                request={projectInvestService.getPagedList}
            >
                {(page: any) =>
                    page.map((e: ProjectInvest) => {
                        return (
                            <div
                                key={e.id}
                                className="bg-[#fff] py-15px px-12px  rounded-5px my-12px"
                            >
                                <div className="flex justify-between text-[15px] text-[#333]">
                                    <div>{e.projectName}</div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mt-15px">
                                        <div>
                                            年月：<span className="text-#999">{e.days}</span>
                                        </div>
                                        <div className="text-[#2864e8] bg-[#EBF3FE] p-4px">
                                            正常项目
                                        </div>
                                    </div>
                                    <div>
                                        形象：<span className="text-#999">{e.imageSchedule}</span>
                                    </div>
                                    <div>
                                        形象投资：
                                        <span className="text-#999">{e.imageAmount}万元</span>
                                    </div>
                                </div>
                                <div className="flex justify-between border-t-1px border-[#eee] mt-16px pt-12px px-20px">
                                    <div
                                        onClick={() => {
                                            projectInvestService
                                                .sendNotice(e.id)
                                                .subscribe((res) => {
                                                    Toast.show({ content: res.msg })
                                                })
                                        }}
                                        className="text-[#2b64e8] text-13px"
                                    >
                                        催办
                                    </div>
                                    <div
                                        onClick={() => {
                                            n(`/project-invest-detail/${e.id}`)
                                        }}
                                        className="text-[#2b64e8] text-13px"
                                    >
                                        审核
                                    </div>
                                    <div
                                        onClick={() => {
                                            n(`/project-invest-appraise/${e.id}`)
                                        }}
                                        className="text-[#2b64e8] text-13px"
                                    >
                                        评价
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </PageList>
        </div>
    )
}
