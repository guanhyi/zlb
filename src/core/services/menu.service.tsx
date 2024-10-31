import SvgIcon from '@/shared/components/icon'
import { BaseCurd, BaseUrl } from '@/shared/http/decorator'
import { GetProp, MenuProps } from 'antd'
import { forkJoin } from 'rxjs'
import { create } from 'zustand'
type MenuItem = GetProp<MenuProps, 'items'>[number]

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
    authority() {
        return this._http.get<RemoteResultDTO<string[]>>(`${this.path}/authority`)
    }
    authRouter() {
        return this._http.get<RemoteResultDTO<SysMenu[]>>(`${this.path}/route`)
    }
    getAuthList() {
        return forkJoin([this.authority(), this.authRouter()])
    }

    filterMenu = (data: SysMenu[]): MenuItem[] => {
        return data.map((item) => {
            let _item: MenuItem
            if (!item.children || item.children.length === 0) {
                _item = {
                    // icon: item.icon,
                    key: item.path,
                    label: item.title
                }
            } else {
                _item = {
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
}
