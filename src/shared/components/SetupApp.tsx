import { connectInjector } from '@wendellhu/redi/react-bindings'
import ReactDOM from 'react-dom/client'
import NiceModal from '@ebay/nice-modal-react'

import { RootProvider } from '../../core/root.service'
import { StartupLoading } from './StartupLoading'
import { Injector } from '@wendellhu/redi'
import { RouteObject, RouterProvider, createHashRouter, Outlet } from 'react-router-dom'
import { ROUTER } from '../../core/services/router.service'
import 'dayjs/locale/zh-cn'
export const setupApp = (routes: RouteObject[] = []) => {
    const routesProvider = createHashRouter([
        {
            path: '/',
            element: (
                <StartupLoading>
                    <Outlet />
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
