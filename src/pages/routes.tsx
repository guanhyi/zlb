import { RouteObject } from 'react-router-dom'
import { FkView } from './FkView'
import { SuccsesView } from './SuccsesView'

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <FkView />
    },
    {
        path: '/success',
        element: <SuccsesView />
    }
]
