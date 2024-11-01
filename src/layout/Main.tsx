import { Scrollbar } from '@/shared/components/Scrollbar'
import { Content } from 'antd/es/layout/layout'
import { CSSProperties } from 'react'
import { Outlet } from 'react-router-dom'
import { LayoutConfig } from './config'
// import { LayoutBreadcrumb } from './_common/Breadcrumb'

export const Main = () => {
    const mainStyle: CSSProperties = {
        height: `calc(100% - ${LayoutConfig.HEADER_HEIGHT})px`
    }

    return (
        // <Content className="flex overflow-auto">
        //     {/* <LayoutBreadcrumb /> */}
        //     <div className="m-a h-full w-full flex-grow">

        //     </div>
        // </Content>
        <Scrollbar
            style={{
                height: 'calc(100% - 60px)'
            }}
            className="p-8 w-full"
        >
            <Outlet />
        </Scrollbar>
    )
}
