import { Layout } from '@/layout/Layout'
import { RouteObject } from 'react-router-dom'
import { TestView } from './Test'
import { AuthenticationPage } from './authentication/Authentication'
import { StartupLoading } from '@/shared/components/StartupLoading'

export const routes: RouteObject[] = [
    {
        path: '/',
        element: (
            <StartupLoading>
                <Layout />
            </StartupLoading>
        ),
        children: [
            {
                path: '/testView',
                element: <TestView />
            }
        ]
    },
    {
        path: '/authentication',
        element: <AuthenticationPage />
    }
]
