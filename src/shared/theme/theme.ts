import { ThemeConfig } from 'antd'

export const themeToken: ThemeConfig = {
    token: {
        wireframe: false,
        colorPrimary: '#165dff',
        colorError: '#f53f3f',
        colorWarning: '#f7ba1e',
        colorBorder: '#e5e6eb',

        borderRadiusSM: 2,
        borderRadius: 4,
        borderRadiusLG: 8
    },
    components: {
        Breadcrumb: {
            fontSize: 12,
            separatorMargin: 4
        },
        Menu: {
            fontSize: 14,
            colorFillAlter: 'transparent',
            itemColor: 'rgb(145, 158, 171)',
            motionDurationMid: '0.125s',
            motionDurationSlow: '0.125s'
        }
    }
    // components: {
    //     Input: {
    //         colorBgContainer: '#e5e6eb',
    //         colorBorder: 'transparent'
    //     },
    //     Button: {
    //         colorBorder: '#e5e6eb'

    //         // colorBgContainer: '#e5e6eb',
    //     },
    //     Select: {
    //         colorBgContainer: '#e5e6eb',
    //         colorBorder: 'transparent'
    //     }
    // }
}
