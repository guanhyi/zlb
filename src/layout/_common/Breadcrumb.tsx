import { MenuItem, SysMenuService, useMenuStore } from '@/core/services/menu.service'
import { SwapRightOutlined } from '@ant-design/icons'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Breadcrumb } from 'antd'
import { useMemo } from 'react'
import { Link, useMatches } from 'react-router-dom'

export const LayoutBreadcrumb = () => {
    const matches = useMatches()

    const menuService = useDependency(SysMenuService)
    const { menu } = useMenuStore()

    const menuList = menuService.flattenMenuRoutes(menu)
    // console.log(menuList)

    const breadCrumbs = useMemo(() => {
        const paths = matches.filter((item) => item.pathname !== '/').map((item) => item.pathname)
        const pathRouteMetas = menuList.filter((item) =>
            paths.includes(item!.key as string)
        ) as MenuItem[]

        return pathRouteMetas.map((route: MenuItem): any => {
            //@ts-ignore
            const currentRoute = menu.find((item) => item.key === route?.key)
            //@ts-ignore
            const currentMenuItems = currentRoute?.children ?? []
            // Update menu items for next level
            // currentMenuItems = currentRoute?.children?.filter((item) => !item.meta?.hideMenu) ?? []

            return {
                //@ts-ignore
                title: route.label,
                key: route!.key as string,
                ...(currentMenuItems.length > 0 && {
                    menu: {
                        items: currentMenuItems.map((item: any) => ({
                            key: item.children?.[0]?.key || item.key,
                            label: (
                                <Link to={item.children?.[0]?.key || (item.key as string)}>
                                    {item.label}
                                </Link>
                            )
                        }))
                    }
                })
            }
        })
    }, [matches, menu])
    return (
        <Breadcrumb
            items={breadCrumbs}
            className="!text-sm"
            separator={<SwapRightOutlined />}
            // separator={<Iconify icon="ph:dot-duotone" />}
        />
    )
}
