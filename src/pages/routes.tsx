import { RouteObject } from 'react-router-dom'
import { LayoutView } from './Layout'

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <LayoutView />,
        children: [
            {
                path: '/',
                element: <div>zlb</div>
            }
        ]
    }
]
