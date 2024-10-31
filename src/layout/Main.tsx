import { Scrollbar } from '@/shared/components/Scrollbar'
import { Content } from 'antd/es/layout/layout'
import { Outlet } from 'react-router-dom'

export const Main = () => {
    return (
        <Content className="flex overflow-auto">
            <div className="m-a h-full w-full flex-grow">
                <Scrollbar>
                    <Outlet />
                </Scrollbar>
            </div>
        </Content>
    )
}
