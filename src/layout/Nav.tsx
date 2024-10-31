import { Scrollbar } from '@/shared/components/Scrollbar'
import { LayoutConfig } from './config'
import { useMenuStore } from '@/core/services/menu.service'
import { Menu, MenuProps } from 'antd'
import { useLocation, useMatches, useNavigate } from 'react-router-dom'

export const LayoutNav = () => {
    const menuStore = useMenuStore()
    const navigate = useNavigate()
    const matches = useMatches()
    const { pathname } = useLocation()
    const onClick: MenuProps['onClick'] = ({ key }) => {
        // 从扁平化的路由信息里面匹配当前点击的那个
        // const nextLink = flattenedRoutes?.find((el) => el.key === key)

        // 处理菜单项中，外链的特殊情况
        // 点击外链时，不跳转路由，不在当前项目添加tab，不选中当前路由，新开一个 tab 打开外链
        // if (nextLink?.hideTab && nextLink?.frameSrc) {
        //     window.open(nextLink?.frameSrc, '_blank')
        //     return
        // }

        console.log(key)

        navigate(key)
        // props?.closeSideBarDrawer?.()
    }

    return (
        <div
            className="flex h-full flex-col "
            style={{
                width: LayoutConfig.NAV_WIDTH,
                borderRight: `1px dashed #eee`
            }}
        >
            <div className=" relative flex h-20 items-center justify-center py-4 ">admin</div>

            <Scrollbar
                style={{
                    height: 'calc(100% - 60px)'
                }}
            >
                <Menu
                    onClick={onClick}
                    mode="inline"
                    className="h-full !border-none"
                    items={menuStore.menu}
                    defaultSelectedKeys={[pathname]}
                    selectedKeys={[pathname]}
                />
            </Scrollbar>
        </div>
    )
}
