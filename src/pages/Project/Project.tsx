import { useAuthStore } from '@/core/services/auth.service'
import { MenusCountDTO, ProjectDTO, useProjectService } from '@/core/services/project.service'
import { useProjectFavoriteService } from '@/core/services/project_favorite.service'
import { PageList, PageRef } from '@/shared/components/PageList'
import { Button, Form, Input, Loading, SpinLoading, Tabs } from 'antd-mobile'
import { RefObject, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import FavoriteImg from './img/favorite.png'
import UnfavoriteImg from './img/unfavorite.png'
import { Match } from '@/shared/components/control/Match'
import { ProjectPageList } from './ProjectPageList'
import { Switch } from '@/shared/components/control/Switch'
import { AllProjectList } from './components/AllProject'
import { MyProjectList } from './components/MyProject'
import { TownVillageProjectList } from './components/TownVillageProject'
import { LeadProjectList } from './components/LeadProject'
import { MyFavoriteProjectList } from './components/MyFavorite'
import { OrgProjectList } from './components/OrgProject'
import { OrgPicker, OrgRef } from '@/shared/components/OrgPicker'
import { ACLService } from '@/core/services/acl.service'
import { useDependency } from '@wendellhu/redi/react-bindings'
interface TabItem {
    title: string
    key: string
}
export const ProjectView = () => {
    const projectService = useProjectService()
    const projectFavoriteService = useProjectFavoriteService()

    const { user } = useAuthStore()
    const [tabList, setTabList] = useState<TabItem[]>([
        { title: '全部', key: '/app/project/all_project' },
        { title: '领办', key: '/api/v1/app/project/lead_project' },
        { title: '关注', key: '/api/v1/app/project/my_favorite' },
        { title: '我的', key: '/api/v1/app/project/my_project' },
        { title: '部门', key: '/api/v1/app/project/org_project' },
        { title: '乡镇', key: '/api/v1/app/project/town_village_project' }
    ])
    const [authorizedTabs, setAuthorizedTabs] = useState<TabItem[]>([])
    const [menusCount, setMenusCount] = useState<MenusCountDTO[]>([])
    const [type, setType] = useState('全部')
    const aclService = useDependency(ACLService)
    const location = useLocation()
    const [isStateReady, setIsStateReady] = useState(false)
    const { state } = location

    useEffect(() => {
        const filteredTabs = tabList.filter((tab) => aclService.canAbilities(tab.key))
        setAuthorizedTabs(filteredTabs)
        if (state?.type) {
            // 设置默认选中的标签
            if (filteredTabs.length > 0) {
                console.log('11')
                if (state?.type === 'lead') {
                    console.log('22')

                    setType('领办')
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
        projectService.ProjectMenusCount().subscribe((res) => {
            const updatedData = res.data.map((item) => ({
                menus: item.menus.replace('项目', ''),
                count: item.count
            }))
            setMenusCount(updatedData)
        })
    }, [])
    return (
        <div>
            <Tabs
                onChange={(v) => {
                    setType(v)
                }}
                className="bg-[#eff2fa]"
                defaultActiveKey={'全部'}
                activeKey={type}
            >
                {menusCount
                    .filter((e) => {
                        // 查找对应的标签是否在授权列表中
                        return authorizedTabs.some((tab) => tab.title === e.menus)
                    })
                    .map((e) => {
                        return (
                            <Tabs.Tab
                                className="bg-[#ffffff]"
                                title={`${e.menus}(${e.count})`}
                                key={e.menus}
                            ></Tabs.Tab>
                        )
                    })}
            </Tabs>
            <div>
                <Switch>
                    <Match when={type === '全部'}>
                        <AllProjectList></AllProjectList>
                    </Match>
                    <Match when={type === '领办'}>
                        <LeadProjectList></LeadProjectList>
                    </Match>
                    <Match when={type === '关注'}>
                        <MyFavoriteProjectList></MyFavoriteProjectList>
                    </Match>
                    <Match when={type === '我的'}>
                        <MyProjectList></MyProjectList>
                    </Match>
                    <Match when={type === '部门'}>
                        <OrgProjectList></OrgProjectList>
                    </Match>
                    <Match when={type === '乡镇'}>
                        <TownVillageProjectList></TownVillageProjectList>
                    </Match>
                </Switch>
            </div>
        </div>
    )
}
