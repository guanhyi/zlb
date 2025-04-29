import { ProblemDTO, useProblemService } from '@/core/services/problem.service'
import { ProjectDTO } from '@/core/services/project.service'
import { Match } from '@/shared/components/control/Match'
import { Switch } from '@/shared/components/control/Switch'
import { PageList, PageRef } from '@/shared/components/PageList'
import { Button, CapsuleTabs, Empty, SpinLoading, Tabs } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const ProjectProblemView = ({ project }: { project: ProjectDTO }) => {
    const problemService = useProblemService()
    const [loading, setLoading] = useState(false)
    const [type, setType] = useState('问题协调')

    const [problemList, setProblemList] = useState<ProblemDTO[]>([])
    const [coordinationResult, setCoordinationResult] = useState<string>('')
    const pageListRef = useRef<PageRef>(null)
    const handleReload = () => {
        if (pageListRef.current) {
            pageListRef.current.reload() // 调用 reload 方法
        }
    }
    const n = useNavigate()

    useEffect(() => {}, [type])
    return (
        <div>
            <CapsuleTabs
                onChange={(coordinationResult) => {
                    setCoordinationResult(coordinationResult)
                }}
            >
                <CapsuleTabs.Tab title="全部" key="ALL"></CapsuleTabs.Tab>
                <CapsuleTabs.Tab title="尚未协调" key="NOTYETCOORDINATED"></CapsuleTabs.Tab>
                <CapsuleTabs.Tab title="协调成功" key="SUCCEED"></CapsuleTabs.Tab>
                <CapsuleTabs.Tab title="协调失败" key="FAILD"></CapsuleTabs.Tab>
            </CapsuleTabs>
            <PageList
                params={{
                    coordinationResult:
                        coordinationResult === 'ALL' || coordinationResult === ''
                            ? null
                            : coordinationResult,
                    projectId: project.id
                }}
                ref={pageListRef}
                className="h-100vh"
                request={problemService.getPagedList}
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
