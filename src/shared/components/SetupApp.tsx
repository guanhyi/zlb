import { connectInjector, useDependency } from '@wendellhu/redi/react-bindings'
import ReactDOM from 'react-dom/client'
import NiceModal from '@ebay/nice-modal-react'

import { RootProvider } from '../../core/root.service'
import { StartupLoading } from './StartupLoading'
import { Injector } from '@wendellhu/redi'
import { RouteObject, RouterProvider, createHashRouter, Outlet } from 'react-router-dom'
import { ROUTER } from '../../core/services/router.service'
import 'dayjs/locale/zh-cn'
import { useGrantRoleService } from '@/core/services/grant_role.service'
import { PropsWithChildren, useEffect, useState } from 'react'
import { STARTUP_TOKEN } from '@/core/services/startup.service'
import { List, Modal } from 'antd-mobile'
import { useAuthStore } from '@/core/services/auth.service'

const Role = (props: PropsWithChildren) => {
    const RoleList = () => {
        return (
            <List header="选择权限">
                {roleList.map((e, index) => {
                    return (
                        <List.Item
                            onClick={() => {
                                v.loginById(e.userId).subscribe((res) => {
                                    setVisible(false)
                                    // 刷新当前路由
                                    setUpdate(update + 1)
                                })
                            }}
                        >
                            {e.userIdName}
                        </List.Item>
                    )
                })}
            </List>
        )
    }
    const [roleList, setRoleList] = useState<any[]>([])
    const [update, setUpdate] = useState(0)
    const v = useDependency(STARTUP_TOKEN)
    const [visible, setVisible] = useState(false)
    const { user } = useAuthStore()

    const grantRoleService = useGrantRoleService()
    useEffect(() => {
        grantRoleService.getGrantRoleList({ toUserId: user.userId }).subscribe((res: any) => {
            if (res.data === null) {
                setUpdate(update + 1)
            } else {
                setVisible(true)
                setRoleList(res.data)
            }
        })
    }, [])
    return (
        <>
            {roleList.length !== 0 && (
                <>
                    <Modal
                        visible={visible}
                        content={<RoleList></RoleList>}
                        closeOnAction
                        onClose={() => {
                            setVisible(false)
                            setUpdate(update + 1)
                        }}
                        actions={[
                            {
                                key: 'confirm',
                                text: '登录当前帐号'
                            }
                        ]}
                    />
                </>
            )}
            {update ? props.children : null}
        </>
    )
}
export const setupApp = (routes: RouteObject[] = []) => {
    const routesProvider = createHashRouter([
        {
            path: '/',
            element: (
                <StartupLoading>
                    <Role>
                        <Outlet />
                    </Role>
                </StartupLoading>
            ),
            children: routes
        }
    ])
    const rootInjector = new Injector([[ROUTER, { useValue: routesProvider }], ...RootProvider])
    const RootComponent = connectInjector(() => {
        return (
            <NiceModal.Provider>
                {/* <StartupLoading> */}
                <div className="semi-light-scrollbar h-full ">
                    <RouterProvider router={routesProvider} />
                </div>
                {/* </StartupLoading> */}
            </NiceModal.Provider>
        )
    }, rootInjector.createChild())
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RootComponent />)
}
