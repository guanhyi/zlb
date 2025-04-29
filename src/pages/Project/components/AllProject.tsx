import { useAuthStore } from '@/core/services/auth.service'
import { ProjectDTO, useProjectService } from '@/core/services/project.service'
import { useProjectFavoriteService } from '@/core/services/project_favorite.service'
import { PageList, PageRef } from '@/shared/components/PageList'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteImg from '../img/favorite.png'
import UnfavoriteImg from '../img/unfavorite.png'
import { ACLService, useAclService } from '@/core/services/acl.service'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Show } from '@/shared/components/control/Show'
import {
    Button,
    DatePicker,
    DatePickerRef,
    Form,
    Input,
    Picker,
    Popup,
    Selector,
    SideBar,
    Tag
} from 'antd-mobile'
import { OrgRef, OrgPicker } from '@/shared/components/OrgPicker'
import { useDataDictionaryService } from '@/core/services/data_dictionary.service'
import FilterImg from '@/assets/filter.png'
import { Match } from '@/shared/components/control/Match'
import { Switch } from '@/shared/components/control/Switch'
import classNames from 'classnames'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
export const tabs = [
    {
        key: 'key1',
        title: '项目标签'
    },
    {
        key: 'key2',
        title: '行业类别'
    },
    {
        key: 'key3',
        title: '项目进度'
    },
    {
        key: 'key4',
        title: '项目状态'
    },
    {
        key: 'key5',
        title: '项目分类'
    }
]
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
export const AllProjectList = () => {
    const location = useLocation()
    const { state } = location
    const n = useNavigate()
    const pageListRef = useRef<PageRef>(null)
    const projectService = useProjectService()
    const aclService = useDependency(ACLService)
    const projectFavoriteService = useProjectFavoriteService()
    const dictService = useDataDictionaryService()
    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const { user } = useAuthStore()
    const [searchParams, setSearchParams] = useState({
        affiliationYear: dayjs(new Date()).format('YYYY')
    })
    const [projectTagList, setProjectTagList] = useState([])
    const [industryCategoryList, setIndustryCategoryList] = useState([])
    const [projectExceptionList, setProjectExceptionList] = useState([])
    const [activeKey, setActiveKey] = useState('key1')
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const [selectedIndustry, setSelectedIndustry] = useState<string[]>([])
    const [selectedExceptions, setSelectedExceptions] = useState<string[]>([])
    const [selectedProjectStatusStatistics, setSelectedProjectStatusStatistics] = useState('')
    const [selectedProjectClassify, setSelectedProjectClassify] = useState('')

    const search = (params: any) => {
        if (params.affiliationYear) {
            params.affiliationYear = dayjs(params.affiliationYear).format('YYYY')
        }
        setSearchParams({
            projectTag: selectedTags,
            classify: selectedIndustry,
            projectException: selectedExceptions,
            projectStatusStatistics: selectedProjectStatusStatistics || null,
            projectClassify: selectedProjectClassify || null,
            ...params
        })
    }
    const handleReload = () => {
        if (pageListRef.current) {
            pageListRef.current.reload() // 调用 reload 方法
        }
    }
    useEffect(() => {
        dictService.getDictPage().subscribe((res) => {
            for (let index = 0; index < res.data.records.length; index++) {
                const element = res.data.records[index]
                if (element.name === '项目标签') {
                    setProjectTagList(
                        element.children.map((item: any) => {
                            return { label: item.name, value: item.id }
                        })
                    )
                }
                if (element.name === '行业类别') {
                    setIndustryCategoryList(
                        element.children.map((item: any) => {
                            return { label: item.name, value: item.id }
                        })
                    )
                }
                if (element.name === '项目异常') {
                    setProjectExceptionList(
                        element.children.map((item: any) => {
                            return { label: item.name, value: item.id }
                        })
                    )
                }
            }
        })
    }, [])
    const [isStateReady, setIsStateReady] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        if (state) {
            setActiveKey('key4')
            setSelectedProjectStatusStatistics(state?.projectType)
            setSelectedExceptions([state.projectException])
            setSelectedProjectClassify(state.projectClassify)
            search({
                projectStatusStatistics: state?.projectType,
                projectClassify: state?.projectClassify,
                projectException: [state.projectException],
                affiliationYear: dayjs(new Date()).format('YYYY')
            })
            // 延迟设置状态就绪标志
            setTimeout(() => {
                setIsStateReady(true)
            }, 300)
        } else {
            setIsStateReady(true)
        }
    }, [state])

    return (
        <div>
            <Form
                layout="horizontal"
                onFinish={search}
                form={form}
                initialValues={{ projectName: '', affiliationYear: new Date() }}
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
                    label="年份"
                    trigger="onConfirm"
                    onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                        datePickerRef.current?.open()
                    }}
                >
                    <DatePicker defaultValue={new Date()} precision="year">
                        {(value) => (value ? dayjs(value).format('YYYY') : '请选择年份')}
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
                                options={projectTagList}
                                multiple
                                style={{
                                    '--border': 'solid transparent 1px',
                                    '--checked-border': 'solid var(--adm-color-primary) 1px',
                                    '--padding': '2px 4px'
                                }}
                                columns={2}
                                value={selectedTags}
                                onChange={(arr) => setSelectedTags(arr)}
                            />
                        </Show>
                        <Show when={activeKey === 'key2'}>
                            <Selector
                                options={industryCategoryList}
                                multiple
                                style={{
                                    '--border': 'solid transparent 1px',
                                    '--checked-border': 'solid var(--adm-color-primary) 1px',
                                    '--padding': '2px 4px'
                                }}
                                columns={2}
                                value={selectedIndustry}
                                onChange={(arr) => setSelectedIndustry(arr)}
                            />
                        </Show>
                        <Show when={activeKey === 'key3'}>
                            <Selector
                                options={projectExceptionList}
                                multiple
                                style={{
                                    '--border': 'solid transparent 1px',
                                    '--checked-border': 'solid var(--adm-color-primary) 1px',
                                    '--padding': '2px 4px'
                                }}
                                columns={2}
                                value={selectedExceptions}
                                onChange={(arr) => setSelectedExceptions(arr)}
                            />
                        </Show>
                        <Show when={activeKey === 'key4'}>
                            <Selector
                                options={[
                                    { label: '新开工项目', value: 'NewStartProject' },
                                    { label: '已开工项目', value: 'StartedProjects' },
                                    { label: '未开工项目', value: 'UnStartedProject' },
                                    { label: '已完工项目', value: 'CompletedProject' }
                                ]}
                                style={{
                                    '--border': 'solid transparent 1px',
                                    '--checked-border': 'solid var(--adm-color-primary) 1px',
                                    '--padding': '2px 4px'
                                }}
                                columns={2}
                                value={[selectedProjectStatusStatistics]}
                                onChange={(arr) => {
                                    setSelectedProjectStatusStatistics(arr[0])
                                }}
                            />
                        </Show>
                        <Show when={activeKey === 'key5'}>
                            <Selector
                                options={[
                                    { label: '前期项目', value: 'PROPHASE' },
                                    { label: '重点项目', value: 'KEYPOINT' }
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
                    <Button
                        className="mr-2"
                        block
                        onClick={() => {
                            setSelectedTags([])
                            setSelectedIndustry([])
                            setSelectedExceptions([])
                            setSelectedProjectStatusStatistics('')
                            setSelectedProjectClassify('')
                        }}
                    >
                        清除
                    </Button>
                    <Button
                        className="ml-2"
                        block
                        color="primary"
                        onClick={() => {
                            search({
                                projectTag: selectedTags,
                                classify: selectedIndustry,
                                projectException: selectedExceptions,
                                projectStatusStatistics: selectedProjectStatusStatistics || null,
                                projectClassify: selectedProjectClassify || null,
                                ...form.getFieldsValue()
                            })
                            setVisible(false)
                        }}
                    >
                        查询
                    </Button>
                </div>
            </Popup>
            {isStateReady && (
                <PageList
                    ref={pageListRef}
                    className="h-100vh"
                    params={searchParams}
                    request={projectService.getPagedList}
                >
                    {(page: any) =>
                        page.map((e: ProjectDTO) => {
                            return (
                                <div
                                    key={e.id}
                                    className="bg-[#fff] py-15px px-12px  rounded-5px my-12px"
                                >
                                    <div
                                        onClick={() => {
                                            n(`/project-outline/${e.id}`)
                                        }}
                                        className="flex justify-between items-center text-[15px] text-[#333]"
                                    >
                                        <div className="truncate flex-1">{e.name}</div>
                                        <div className="flex items-center">
                                            <div className="text-#999 mx-4">{'详情'}</div>
                                            <img
                                                className="w-28px h-26px"
                                                src={e.isFavorite ? FavoriteImg : UnfavoriteImg}
                                                alt=""
                                            />
                                        </div>
                                    </div>
                                    <div
                                        onClick={() => {
                                            n(`/project-outline/${e.id}`)
                                        }}
                                        className="flex justify-between items-center mt-15px"
                                    >
                                        <div className="text-[#2864e8] bg-[#EBF3FE] p-4px">
                                            {e.projectTagNameList[0]}
                                        </div>
                                        <div className="text-[13px] text-[#999]">
                                            投资进度：{e.plannedAmountTotal}/{e.imageAmountTotal}
                                            万元
                                        </div>
                                    </div>
                                    <div className="flex justify-between border-t-1px border-[#eee] mt-16px pt-12px px-20px">
                                        <div
                                            onClick={() => {
                                                n(`/supervise-project/${e.id}`)
                                            }}
                                            className="text-[#2b64e8] text-13px"
                                        >
                                            批示督办
                                        </div>
                                        <div
                                            onClick={() => {
                                                if (e.isFavorite) {
                                                    projectFavoriteService
                                                        .cancelFavorite(e.id)
                                                        .subscribe((res) => {
                                                            handleReload()
                                                        })
                                                } else {
                                                    projectFavoriteService
                                                        .createFavorite(e.id, user.userId)
                                                        .subscribe((res) => {
                                                            handleReload()
                                                        })
                                                }
                                            }}
                                            className="text-[#2b64e8] text-13px"
                                        >
                                            {e.isFavorite ? '取消关注' : '关注'}
                                        </div>
                                        <Show
                                            when={aclService.canAbilities(
                                                '/api/app/instructions_supervise/my_paged_list'
                                            )}
                                        >
                                            <div
                                                onClick={() => {
                                                    n(`/declare-problem/${e.id}`)
                                                }}
                                                className="text-[#2b64e8] text-13px"
                                            >
                                                问题申报
                                            </div>
                                        </Show>
                                    </div>
                                </div>
                            )
                        })
                    }
                </PageList>
            )}
        </div>
    )
}
