import SvgIcon from '@/shared/components/icon'
import { BaseCurd, BaseLoading, BaseUrl } from '@/shared/http/decorator'
import { GetProp, MenuProps } from 'antd'
import { forkJoin, lastValueFrom } from 'rxjs'
import { create } from 'zustand'
export type MenuItem = GetProp<MenuProps, 'items'>[number]

type State = {
    menu: MenuItem[]
}

type Action = {
    setMenu: (menu: MenuItem[]) => void
}

/**
 * <p>
 * 菜单数据VO
 * </p>
 *
 * @author cxy
 * @since 2023-08-22
 */
/**
 * <p>
 * 菜单数据
 * </p>
 *
 */
export interface SysMenu extends BaseEntity {
    /**
     *  "上级ID，一级菜单为0")
     */
    pid: string

    /**
     *  "别名")
     */
    name: string

    /**
     *  "菜单名称")
     */
    title: string

    /**
     *  "菜单URL")
     */
    path: string

    /**
     *  "组件")
     */
    component: string

    /**
     *  "授权标识")
     */
    authority: string

    /**
     *  "类型   0：菜单   1：按钮   2：接口")
     */
    type: boolean

    /**
     *  "打开方式   0：内部   1：外部")
     */
    openStyle: boolean

    /**
     *  "菜单图标")
     */
    icon: string

    /**
     *  "排序")
     */
    sort: number

    /**
     *  "是否固定")
     */
    affix: boolean

    /**
     *  "标签")
     */
    tag: string

    /**
     *  "隐藏菜单 0：否 1：是")
     */
    hidden: boolean

    /**
     *  "隐藏面包屑 0：否 1：是")
     */
    hiddenBreadcrumb: boolean

    /**
     *  "版本号")
     */
    version: number

    children?: SysMenu[]
}
/**
 * <p>
 * 菜单数据VO
 * </p>
 *
 * @author cxy
 * @since 2023-08-22
 */
export interface SysMenuVO {
    /**
     *  "别名")
     */
    name: string

    /**
     *  "菜单名称")
     */
    title: string

    /**
     *  "菜单URL")
     */
    path: string

    /**
     *  "组件")
     */
    component: string

    /**
     *  "授权标识")
     */
    authority: string

    /**
     *  "类型   0：菜单   1：按钮   2：接口")
     */
    type: 0 | 1 | 2

    /**
     *  "打开方式   0：内部   1：外部")
     */
    openStyle: 0 | 1

    /**
     *  "菜单图标")
     */
    icon: string

    /**
     *  "排序")
     */
    sort: number

    /**
     *  "是否固定")
     */
    affix: number

    /**
     *  "标签")
     */
    tag: string

    /**
     *  "隐藏菜单 0：否 1：是")
     */
    hidden: 0 | 1

    /**
     *  "隐藏面包屑 0：否 1：是")
     */
    hiddenBreadcrumb: 0 | 1

    /**
     *  "版本号")
     */
    version: string

    /**
     *  "菜单元数据")
     */
    // private Meta meta;

    /**
     * 主键
     */
    id: number

    /**
     * 上级ID
     */
    pid: string
    /**
     * 子节点列表
     */
    children: SysMenuVO[]
}

export const useMenuStore = create<State & Action>((set) => ({
    menu: [
        {
            key: '1',
            label: '首页',
            children: [
                {
                    key: '/testView',
                    label: '首页1'
                }
            ]
        }
    ],
    setMenu: (menu) => set({ menu })
}))

/**
 * 菜单数据 服务
 */
@BaseUrl('/api/system/menu')
export class SysMenuService extends BaseCurd<SysMenu> {
    tableLoading = new BaseLoading()
    authority() {
        return this._http.get<RemoteResultDTO<string[]>>(`${this.path}/authority`)
    }
    authRouter() {
        return this._http.get<RemoteResultDTO<SysMenu[]>>(`${this.path}/route`)
    }
    getAuthList() {
        return forkJoin([this.authority(), this.authRouter()])
    }

    menuSave = (data: any) => {
        return this._http
            .post<RemoteResultDTO<any>>(`${this.path}/save`, {
                ...data
            })
            .pipe(this.saveLoading.requestChangeLoading())
    }
    /**
     * 根据菜单id 获取页面的按钮
     * @param id 菜单id
     * @returns
     */
    buttons = async (id: string): Promise<RemoteResultDTO<SysMenuVO[]>> => {
        const source$ = this._http.get<RemoteResultDTO<SysMenuVO[]>>(`${this.path}/buttons`, {
            id
        })
        return await lastValueFrom(source$)
    }

    /**
     *  找出指定id 的所有顶级节点id 摊平数据
     * */
    getPID = (_menus: any[], id: string) => {
        const menus = this.flattenItems(_menus as any, 'children')
        const menu = menus.find((e: any) => e.id == id)
        if (!menu) {
            return []
        }
        const menuIds: string[] = [id]

        let pid = menu.pid
        while (true) {
            const pMenu = menus.find((e: any) => e.id == pid)
            if (pMenu) {
                pid = pMenu.pid
                menuIds.unshift(pMenu.id)
            } else {
                break
            }
        }
        return menuIds
    }

    /**
     *
     * @param type
     * @returns
     */
    listByType = async (type: any, force: boolean = false): Promise<SysMenuVO[]> => {
        // if (!force && Array.isArray(this.Menus.value) && this.Menus.value.length > 0) {
        //     return this.Menus.value
        // }
        const source$ = this._http
            .get<RemoteResultDTO<SysMenuVO[]>>(`${this.path}/list`, {
                type
            })
            .pipe(this.tableLoading.requestChangeLoading())
        const res = await lastValueFrom(source$)

        return res.data
    }

    removeNullChild = (data: SysMenuVO[]): SysMenuVO[] => {
        let res: SysMenuVO[] = []
        for (let i = 0; i < data.length; i++) {
            if (data[i].children && data[i].children.length > 0) {
                res.push({
                    ...data[i],
                    children: this.removeNullChild(data[i].children)
                })
            } else {
                //@ts-ignore
                res.push({ ...data[i], children: undefined })
            }
        }
        return res
    }

    filterMenu = (data: SysMenu[]): MenuItem[] => {
        return data.map((item) => {
            let _item: MenuItem
            if (!item.children || item.children.length === 0) {
                _item = {
                    //@ts-ignore
                    id: item.id,
                    // icon: item.icon,
                    key: item.path,
                    label: item.title
                }
            } else {
                _item = {
                    //@ts-ignore
                    id: item.id,
                    // icon: item.icon,
                    key: item.path,
                    label: item.title,
                    children: this.filterMenu(item.children)
                }
            }

            // if (item.icon) {
            //     _item.icon = <SvgIcon icon={item.icon} size={24} className="ant-menu-item-icon" />
            // }

            return _item
        })
    }
    /**
     * return flatten routes
     */
    flattenMenuRoutes = (routes: MenuItem[]): MenuItem[] => {
        return routes.reduce<MenuItem[]>((prev, item) => {
            //@ts-ignore
            const { children, ..._i } = item
            //@ts-ignore
            prev.push(_i)
            if (children && children.length > 0) prev.push(...this.flattenMenuRoutes(children))
            return prev
        }, [])
    }
}
