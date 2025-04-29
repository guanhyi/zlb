import { ACLService } from '@/core/services/acl.service'
import { ProblemDTO, useProblemService } from '@/core/services/problem.service'
import { useStagingService } from '@/core/services/staging.service'
import { Match } from '@/shared/components/control/Match'
import { Show } from '@/shared/components/control/Show'
import { Switch } from '@/shared/components/control/Switch'
import { PageList, PageRef } from '@/shared/components/PageList'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Button, CapsuleTabs, Empty, SpinLoading, Tabs } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface TabItem {
    title: string
    key: string
}

export const ProblemView = () => {
    const problemService = useProblemService()
    const aclService = useDependency(ACLService)
    const stagingService = useStagingService()
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState<string>('')
    const [tabList, setTabList] = useState<TabItem[]>([
        { title: '问题协调', key: '/api/app/problem_coordination/need_deal_problem' },
        { title: '我的问题', key: '/api/app/problem_coordination/my_problem' },
        { title: '部门问题', key: '/api/app/problem_coordination/org_problem' }
    ])
    const [authorizedTabs, setAuthorizedTabs] = useState<TabItem[]>([])

    useEffect(() => {
        // 确保 aclService 已经初始化
        const filteredTabs = tabList.filter((tab) => aclService.canAbilities(tab.key))
        setAuthorizedTabs(filteredTabs)

        // 设置默认选中的标签
        if (filteredTabs.length > 0 && !type) {
            setType(filteredTabs[0].title)
        }
    }, [aclService])
    const [problemList, setProblemList] = useState<ProblemDTO[]>([])
    const [coordinationResult, setCoordinationResult] = useState<string>('')
    const pageListRef = useRef<PageRef>(null)
    const handleReload = () => {
        if (pageListRef.current) {
            pageListRef.current.reload() // 调用 reload 方法
        }
    }
    const n = useNavigate()
    const requestMap = {
        问题协调: stagingService.getProblemPagedList,
        我的问题: problemService.getMyPagedList,
        部门问题: problemService.getOrgPagedList
    } as any
    return (
        <div>
            <Tabs onChange={setType} className="bg-[#eff2fa]" activeKey={type}>
                {authorizedTabs.map((tab) => (
                    <Tabs.Tab
                        className="bg-[#ffffff]"
                        title={tab.title}
                        key={tab.title}
                        forceRender={true}
                    >
                        <CapsuleTabs onChange={setCoordinationResult}>
                            <CapsuleTabs.Tab title="全部" key="ALL"></CapsuleTabs.Tab>
                            <CapsuleTabs.Tab
                                title="尚未协调"
                                key="NOTYETCOORDINATED"
                            ></CapsuleTabs.Tab>
                            <CapsuleTabs.Tab title="协调成功" key="SUCCEED"></CapsuleTabs.Tab>
                            <CapsuleTabs.Tab title="协调失败" key="FAILD"></CapsuleTabs.Tab>
                        </CapsuleTabs>
                    </Tabs.Tab>
                ))}
            </Tabs>
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
                            <div key={e.id}>
                                <div className="bg-[#fff] py-15px px-12px  rounded-5px my-12px">
                                    <div className="flex justify-between text-[15px] text-[#333]">
                                        <div>{e.taskName}</div>
                                    </div>
                                    <div className="flex my-16px">
                                        <div className="text-[#FFA442] mr-2">
                                            {e.coordinationResultName}
                                        </div>
                                        <div className="text-[#999]">{e.declarationOrgName}</div>
                                    </div>
                                    <div>
                                        <Show
                                            when={aclService.canAbilities(
                                                '/api/app/problem_coordination/need_deal_problem'
                                            )}
                                        >
                                            {type === '问题协调' && (
                                                <Button
                                                    onClick={() => {
                                                        n(`/problem-detail/${e.id}`)
                                                    }}
                                                    block
                                                    color="primary"
                                                    size="small"
                                                >
                                                    问题协调
                                                </Button>
                                            )}
                                        </Show>
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
