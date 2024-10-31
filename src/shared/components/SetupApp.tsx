import { connectInjector } from '@wendellhu/redi/react-bindings'
import ReactDOM from 'react-dom/client'
import NiceModal from '@ebay/nice-modal-react'

import { RootProvider } from '../../core/root.service'
import { StartupLoading } from './StartupLoading'
import { Injector } from '@wendellhu/redi'
import { ProConfigProvider } from '@ant-design/pro-components'
import { RouteObject, RouterProvider, createHashRouter, Outlet } from 'react-router-dom'
import { ROUTER } from '../../core/services/router.service'
import { ConfigProvider } from 'antd'
import 'dayjs/locale/zh-cn'
import zhCNIntl from 'antd/es/locale/zh_CN'
import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs'
import { themeToken } from '../theme/theme'
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
            <StyleProvider transformers={[legacyLogicalPropertiesTransformer]} hashPriority="high">
                <NiceModal.Provider>
                    <ProConfigProvider hashed={false}>
                        <ConfigProvider theme={themeToken} locale={zhCNIntl}>
                            {/* <StartupLoading> */}
                            <div className="semi-light-scrollbar h-full ">
                                <RouterProvider router={routesProvider} />
                            </div>
                        </ConfigProvider>
                        {/* </StartupLoading> */}
                    </ProConfigProvider>
                </NiceModal.Provider>
            </StyleProvider>
        )
    }, rootInjector.createChild())
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<RootComponent />)
}
