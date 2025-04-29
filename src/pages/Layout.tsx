import { Zlb } from '@/shared/components/zlb/Zlb'
import { Outlet } from 'react-router-dom'
import { Badge, List, Modal, TabBar } from 'antd-mobile'
import HomeIcon from '@/assets/home.png'
import HomeIconN from '@/assets/home-n.png'
import ProjectIcon from '@/assets/project.png'
import ProjectIconN from '@/assets/project-n.png'
import MyIcon from '@/assets/my.png'
import MyIconN from '@/assets/my-n.png'
import QuestionIcon from '@/assets/question.png'
import QuestionIconN from '@/assets/question-n.png'
import CommentsIcon from '@/assets/comments.png'
import CommentsIconN from '@/assets/comments-n.png'
import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/core/services/auth.service'
import { STARTUP_TOKEN } from '@/core/services/startup.service'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { useGrantRoleService } from '@/core/services/grant_role.service'

function sendZzdLog(accountId: string, accountName: string, location: any) {
    const dev_id: any =
        localStorage.getItem('dev_id') || Math.random() * 100000000000000000 + '_zzd'
    localStorage.setItem('dev_id', dev_id)
    //@ts-ignore
    aplus_queue.push({
        action: 'aplus.setMetaInfo',
        arguments: ['_hold', 'BLOCK']
    })
    // 单⻚应用 或 “单个⻚面”需异步补充PV日志参数还需进行如下埋点：
    //@ts-ignore

    aplus_queue.push({
        action: 'aplus.setMetaInfo',
        arguments: ['aplus-waiting', 'MAN']
    })
    // 单页应用路由切换后 或 在异步获取到pv日志所需的参数后再执行sendPV：
    //@ts-ignore

    aplus_queue.push({
        action: 'aplus.sendPV',
        arguments: [
            {
                is_auto: false
            },
            {
                // 当前你的应用信息，此两行请勿修改
                sapp_id: '43977',
                sapp_name: 'LQSHZL',
                dev_type: '01',
                is_digital_reform: '1',
                is_workbench: '1',
                page_name: location.pathname,
                page_id: encodeURIComponent(location.pathname),
                page_url: window.location.href
            } // page_id、page_name、page_url
        ]
    })

    if (accountName) {
        //@ts-ignore

        aplus_queue.push({
            action: 'aplus.setMetaInfo',
            arguments: ['_user_nick', accountName]
        })
    }
    if (accountId) {
        //@ts-ignore

        aplus_queue.push({
            action: 'aplus.setMetaInfo',
            arguments: ['_user_id', accountId] // 设置会员ID
        })
    }
    //@ts-ignore

    aplus_queue.push({
        action: 'aplus.setMetaInfo',
        arguments: ['_dev_id', dev_id] //
    })
    // 如采集用户信息是异步行为，需要先设置完用户信息后再执行这个START埋点
    // 此时被block住的日志会携带上用户信息逐条发出
    //@ts-ignore

    aplus_queue.push({
        action: 'aplus.setMetaInfo',
        arguments: ['_hold', 'START']
    })
}
export const LayoutView = () => {
    const tabs = [
        {
            key: '/home',
            title: '概览',
            icon: (active: boolean) =>
                active ? (
                    <img className="w-[18px]" src={HomeIcon}></img>
                ) : (
                    <img className="w-[18px]" src={HomeIconN}></img>
                )
        },
        {
            key: '/project',
            title: '项目',
            icon: (active: boolean) =>
                active ? (
                    <img className="w-[18px]" src={ProjectIcon}></img>
                ) : (
                    <img className="w-[18px]" src={ProjectIconN}></img>
                )
        },
        {
            key: '/my',
            title: '我的',
            icon: (active: boolean) =>
                active ? (
                    <img className="w-[18px]" src={MyIcon}></img>
                ) : (
                    <img className="w-[18px]" src={MyIconN}></img>
                )
        },
        {
            key: '/problem',
            title: '问题',
            icon: (active: boolean) =>
                active ? (
                    <img className="w-[18px]" src={QuestionIcon}></img>
                ) : (
                    <img className="w-[18px]" src={QuestionIconN}></img>
                )
        },
        {
            key: '/comments',
            title: '批示',
            icon: (active: boolean) =>
                active ? (
                    <img className="w-[18px]" src={CommentsIcon}></img>
                ) : (
                    <img className="w-[18px]" src={CommentsIconN}></img>
                )
        }
    ]
    const n = useNavigate()
    const location = useLocation()
    const { user } = useAuthStore()

    const setRouteActive = (value: string) => {
        n(value)
    }

    useEffect(() => {
        sendZzdLog(user.accountId, user.realName || user.username || '', location)
    }, [location.pathname])
    return (
        <>
            <>
                <div className="bg-[#eff2fa] pb-80px min-h-100vh">
                    <Outlet />
                </div>
                <div className=" fixed w-full bottom-0 pt-10px pb-20px bg-#fff">
                    <TabBar
                        defaultActiveKey={'/my'}
                        activeKey={location.pathname}
                        onChange={(value) => setRouteActive(value)}
                    >
                        {tabs.map((item) => (
                            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                        ))}
                    </TabBar>
                </div>
            </>
        </>
    )
}
