import { Outlet, RouteObject } from 'react-router-dom'
import { SystemMenuView } from './menu/SystemMenuView'
import { RoleView } from './role/RoleView'
import { SysUserView } from './user/UserView'
import { DeptView } from './dept/DeptView'

export const SYSTEM_ROUTEING: RouteObject[] = [
    {
        path: '/system',
        element: <Outlet />,
        children: [
            {
                path: 'menu',
                element: <SystemMenuView />
            },
            {
                path: 'role',
                element: <RoleView />
            },
            {
                path: 'user',
                element: <SysUserView />
            },
            {
                path: 'dept',
                element: <DeptView />
            }
        ]
    }
]
