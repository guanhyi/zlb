import MyBg from '@/assets/my-bg.png'
import styled from 'styled-components'
import MyIcon from '@/assets/my.png'
import UserCardBg from '@/assets/user-card.png'
import PendingIcon from '@/assets/pending.png'
import Type1 from '@/assets/type1.png'
import Type2 from '@/assets/type2.png'
import Type3 from '@/assets/type3.png'
import Type4 from '@/assets/type4.png'
import Type5 from '@/assets/type5.png'
import Type6 from '@/assets/type6.png'
import Type7 from '@/assets/type7.png'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { useMyService } from '@/core/services/my.service'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/core/services/auth.service'
import { useNavigate } from 'react-router-dom'
import { MailFill, MailOpenOutline, MailOutline } from 'antd-mobile-icons'
import { useRolesService } from '@/core/services/role.service'
import { List, Modal, Space, Tag } from 'antd-mobile'
import { Show } from '@/shared/components/control/Show'
import { ACLService } from '@/core/services/acl.service'
import { useGrantRoleService } from '@/core/services/grant_role.service'
import { STARTUP_TOKEN, StartupService } from '@/core/services/startup.service'

const Bg = styled.div`
    background: url(${MyBg});
    background-size: contain;
    background-repeat: no-repeat;
    padding: 14px;
`

const UserCard = styled.div`
    background: url(${UserCardBg});
    background-size: contain;
    background-repeat: no-repeat;
    padding: 22px 12px;
    display: flex;
`

const ActionCard = styled.div`
    background: #fff;
    margin-top: 15px;
    padding: 22px 12px;
`

const TypeCard = styled.div`
    border-radius: 5px;
    border: 1px solid #e1eaff;
    width: 100%;
    padding: 30px 12px 15px 12px;
`

const PendingPic = styled.div`
    position: absolute;
    width: 75px;
    top: -10px;
    height: 25px;
`

const NavBar = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 22px 0;
    border-bottom: 1px solid #e1eaff;
`

const navList = [
    { title: '授权管理', path: '/grant-role', key: '/api/v1/app/grant_role/create' },
    { title: '消息管理（发改）', path: '/ding-info/1', key: '/ding-info/1' },
    { title: '消息管理', path: '/ding-info/0', key: '/ding-info/0' },
    { title: '节点审批', path: '/task', key: '/task' },
    { title: '节点审核', path: '/approve-task', key: '/approve-task' },
    { title: '月报审核', path: '/project-invest', key: '/project-invest' }
]

export const MyView = () => {
    const myService = useMyService()
    const { user } = useAuthStore()
    const [pendingProcessing, setPendingProcessing] = useState({
        approveTaskCount: 0,
        examineInvestCount: 0,
        examineTaskCount: 0,
        instructionsSuperviseCount: 0,
        investCount: 0,
        problemCount: 0,
        taskCount: 0
    })
    const [typeList, setTypeList] = useState([
        {
            title: '待填报进度',
            icon: Type1,
            count: 0,
            path: '/pending-project-invest',
            key: '/api/v1/app/my/pending_project_invest'
        },
        {
            title: '待打卡节点',
            icon: Type2,
            count: 0,
            path: '/pending-task',
            key: '/api/v1/app/my/pending_task'
        },
        {
            title: '待协调问题',
            icon: Type3,
            count: 0,
            path: '/problem',
            key: '/coordination_issues',
            type: 'my'
        },
        {
            title: '待反馈批示',
            icon: Type4,
            count: 0,
            path: '/comments',
            key: '/feedback',
            type: 'supervise'
        },
        { title: '待审批节点', icon: Type5, count: 0, path: '/task', key: '/approval_node' },
        {
            title: '待审核节点',
            icon: Type6,
            count: 0,
            path: '/approve-task',
            key: '/Pending_review_nodes'
        },
        {
            title: '待审剖月报',
            icon: Type7,
            count: 0,
            path: '/project-invest',
            key: '/Monthly_report_review'
        }
    ])
    const n = useNavigate()
    const [roles, setRoles] = useState<any[]>([])
    const rolesService = useRolesService()
    const aclService = useDependency(ACLService)
    useEffect(() => {
        rolesService.getMyRole().subscribe((res) => {
            setRoles(res.data)
        })
        myService.getPendingProcessing().subscribe((res) => {
            setTypeList([
                {
                    title: '待填报进度',
                    icon: Type1,
                    count: res.data.investCount,
                    path: '/pending-project-invest',
                    key: '/api/v1/app/my/pending_project_invest'
                },
                {
                    title: '待打卡节点',
                    icon: Type2,
                    count: res.data.taskCount,
                    path: '/pending-task',
                    key: '/api/v1/app/my/pending_task'
                },
                {
                    title: '待协调问题',
                    icon: Type3,
                    count: res.data.problemCount,
                    path: '/problem',
                    key: '/coordination_issues'
                },
                {
                    title: '待反馈批示',
                    icon: Type4,
                    count: res.data.instructionsSuperviseCount,
                    path: '/comments',
                    key: '/feedback',
                    type: 'supervise'
                },
                {
                    title: '待审批节点',
                    icon: Type5,
                    count: res.data.approveTaskCount,
                    path: '/task',
                    key: '/approval_node',
                    type: 'NEWBUILT'
                },
                {
                    title: '待审核节点',
                    icon: Type6,
                    count: res.data.examineTaskCount,
                    path: '/approve-task',
                    key: '/Pending_review_nodes',
                    type: 'TOBEREVIEWED'
                },
                {
                    title: '待审核月报',
                    icon: Type7,
                    count: res.data.examineInvestCount,
                    path: '/project-invest',
                    key: '/Monthly_report_review',
                    type: 'TOBEREVIEWED'
                }
            ])
        })
    }, [])
    return (
        <>
            <Bg>
                <div className="flex my-20px mr-20px">
                    <MailOutline
                        onClick={() => {
                            n('/station-message')
                        }}
                        className="ml-auto"
                        color="#fff"
                        fontSize={36}
                    />
                </div>
                <UserCard>
                    <div className="flex items-center mr-80px">
                        <img className="w-24px mr-9px" src={MyIcon} alt="" />
                        <div className="text-20px text-#102c6d">{user.username}</div>
                    </div>
                    <div className="text-13px text-#102c6d">
                        <div>{user.orgName}</div>
                        <Space>
                            {roles.slice(0, 2).map((e) => {
                                return (
                                    <Tag color="primary" fill="outline">
                                        {e.name}
                                    </Tag>
                                )
                            })}
                        </Space>
                    </div>
                </UserCard>
                <ActionCard>
                    <TypeCard className="grid grid-cols-2 gap-18px relative">
                        <PendingPic>
                            <img src={PendingIcon} alt="" />
                        </PendingPic>
                        {typeList.map((e, index) => {
                            return (
                                <Show when={aclService.canAbilities(e.key || '')}>
                                    <div
                                        onClick={() => {
                                            n(e.path, { state: { type: e.type } })
                                        }}
                                        key={index}
                                        className="flex"
                                    >
                                        <img className="w-50px" src={e.icon} alt="" />
                                        <div className="ml-10px">
                                            <div className="text-18px text-#102c6d mb-10px">
                                                {e.count}
                                            </div>
                                            <div className="text-13px text-#666666">{e.title}</div>
                                        </div>
                                    </div>
                                </Show>
                            )
                        })}
                    </TypeCard>
                    <div>
                        {navList.map((e, index) => {
                            return (
                                <Show when={aclService.canAbilities(e.key || '')}>
                                    <NavBar
                                        onClick={() => {
                                            n(e.path)
                                        }}
                                        key={index}
                                    >
                                        <div className="text-15px text-#333333">{e.title}</div>
                                        <div className="text-15px text-#999999">{'>'}</div>
                                    </NavBar>
                                </Show>
                            )
                        })}
                    </div>
                </ActionCard>
            </Bg>
        </>
    )
}
