import { Layout } from '@/layout/Layout'
import { RouteObject } from 'react-router-dom'
import { TestView } from './Test'
import { AuthenticationPage } from './authentication/Authentication'
import { StartupLoading } from '@/shared/components/StartupLoading'
import { SYSTEM_ROUTEING } from './system/system-routing'

export const routes: RouteObject[] = [
    {
        path: '/',
        element: (
            <StartupLoading>
                <Layout />
            </StartupLoading>
        ),
        children: [...SYSTEM_ROUTEING]
    },
    {
        path: '/authentication',
        element: <AuthenticationPage />
    }
]
