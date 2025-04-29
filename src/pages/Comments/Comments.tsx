import { CommentsDTO, useCommentsService } from '@/core/services/comments.service'
import { ProjectDTO, useProjectService } from '@/core/services/project.service'
import { Match } from '@/shared/components/control/Match'
import { Switch } from '@/shared/components/control/Switch'
import { CapsuleTabs, Empty, Loading, SpinLoading, Tabs } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ACLService } from '@/core/services/acl.service'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Subscription } from 'rxjs'
import { PageList, PageRef } from '@/shared/components/PageList'

export const CommentsView = () => {
    const commentsService = useCommentsService()
    const aclService = useDependency(ACLService)
    const [tabList, setTabList] = useState<any[]>([
        { title: '我的批示', key: '/api/app/instructions_supervise/my_paged_list' },
        { title: '其他批示', key: '/api/app/instructions_supervise/other_instruction' },
        { title: '部门批示', key: '/api/app/instructions_supervise/get_org_instructions' },
        { title: '批示反馈', key: '/api/app/instructions_supervise/get_instructions' }
    ])
    const [authorizedTabs, setAuthorizedTabs] = useState<any[]>([])
    const [type, setType] = useState<string>('')
    const location = useLocation()
    const [isStateReady, setIsStateReady] = useState(false)
    const [coordinationResult, setCoordinationResult] = useState<string>('')
    const { state } = location
    useEffect(() => {
        const filteredTabs = tabList.filter((tab) => aclService.canAbilities(tab.key))
        setAuthorizedTabs(filteredTabs)
        if (state?.type) {
            // 设置默认选中的标签
            if (filteredTabs.length > 0 && !type) {
                if (state?.type === 'supervise') {
                    setType('批示反馈')
                } else {
                    setType(filteredTabs[0].title)
                }
            }
            setTimeout(() => {
                setIsStateReady(true)
            }, 300)
        } else {
            setType(filteredTabs[0].title)
            setIsStateReady(true)
        }
    }, [aclService])
    const [projectList, setProjectList] = useState<CommentsDTO[]>([])
    const [loading, setLoading] = useState(false)
    const [cancel, setCancel] = useState<Subscription>()
    const pageListRef = useRef<PageRef>(null)

    const n = useNavigate()
    useEffect(() => {
        // getData()
    }, [])

    const requestMap = {
        我的批示: commentsService.getMyPagedList,
        其他批示: commentsService.getOtherPagedList,
        部门批示: commentsService.getOrgPagedList,
        批示反馈: commentsService.getInstructionPagedList
    } as any
    return (
        <div>
            <Tabs onChange={setType} className="bg-[#eff2fa]" activeKey={type}>
                {authorizedTabs.map((tab) => {
                    return (
                        <Tabs.Tab className="bg-[#ffffff]" title={tab.title} key={tab.title}>
                            <CapsuleTabs onChange={setCoordinationResult}>
                                <CapsuleTabs.Tab title="全部" key="ALL"></CapsuleTabs.Tab>
                                <CapsuleTabs.Tab
                                    title="尚未协调"
                                    key="NOTYETCOORDINATED"
                                ></CapsuleTabs.Tab>
                                <CapsuleTabs.Tab title="协调成功" key="SUCCEED"></CapsuleTabs.Tab>
                                <CapsuleTabs.Tab title="协调失败" key="FAILD"></CapsuleTabs.Tab>
                            </CapsuleTabs>
                            {/* {isStateReady &&
                                projectList.map((e) => {
                                    return (
                                        <div
                                            key={e.id}
                                            onClick={() => {
                                                n(`/comments-details/${e.id}`)
                                            }}
                                            className="bg-[#fff] py-15px px-12px  rounded-5px my-12px"
                                        >
                                            <div className="flex justify-between text-[15px] text-[#333]">
                                                <div>{e.instructionsContent}</div>
                                                <div>{'>'}</div>
                                            </div>
                                            <div className="flex justify-between items-center mt-15px">
                                                <div className="text-[#999]">
                                                    {e.responsibleOrgName}
                                                </div>
                                            </div>
                                            <div className="flex justify-between  mt-16px py-11px px-12px bg-[#F8F8F8]">
                                                <div className=" flex text-13px items-center">
                                                    <div className="text-20px text-[#2b64e8] mr-[5px]">
                                                        ·
                                                    </div>
                                                    <div className="text-[#999]">类型：</div>
                                                    <div className="text-[#2b64e8]">
                                                        {e.typeName}
                                                    </div>
                                                </div>
                                                <div className="flex text-13px items-center">
                                                    <div className=" text-20px text-[#FFA442] mr-[5px]">
                                                        ·
                                                    </div>
                                                    <div className="text-[#999]">状态：</div>
                                                    <div className="text-[#FFA442]">
                                                        {e.stateName}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })} */}
                        </Tabs.Tab>
                    )
                })}
            </Tabs>
            {isStateReady && (
                <PageList
                    params={{
                        coordinationResult:
                            coordinationResult === 'ALL' || coordinationResult === ''
                                ? null
                                : coordinationResult
                    }}
                    ref={pageListRef}
                    className="h-100vh"
                    request={requestMap[type]}
                >
                    {(page: any) =>
                        page.map((e: any) => {
                            return (
                                <div
                                    key={e.id}
                                    onClick={() => {
                                        n(`/comments-details/${e.id}`)
                                    }}
                                    className="bg-[#fff] py-15px px-12px  rounded-5px my-12px"
                                >
                                    <div className="flex justify-between text-[15px] text-[#333]">
                                        <div>{e.instructionsContent}</div>
                                        <div>{'>'}</div>
                                    </div>
                                    <div className="flex justify-between items-center mt-15px">
                                        <div className="text-[#999]">{e.responsibleOrgName}</div>
                                    </div>
                                    <div className="flex justify-between  mt-16px py-11px px-12px bg-[#F8F8F8]">
                                        <div className=" flex text-13px items-center">
                                            <div className="text-20px text-[#2b64e8] mr-[5px]">
                                                ·
                                            </div>
                                            <div className="text-[#999]">类型：</div>
                                            <div className="text-[#2b64e8]">{e.typeName}</div>
                                        </div>
                                        <div className="flex text-13px items-center">
                                            <div className=" text-20px text-[#FFA442] mr-[5px]">
                                                ·
                                            </div>
                                            <div className="text-[#999]">状态：</div>
                                            <div className="text-[#FFA442]">{e.stateName}</div>
                                        </div>
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
