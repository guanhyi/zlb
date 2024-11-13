import { environment } from '@/environments/environment'

export const useZWJSBridge = () => {
    //@ts-ignore
    const ZWJSBridge =
        environment.type !== 'dev'
            ? //@ts-ignore
              window.ZWJSBridge
            : {
                  ssoTicket: () => {},
                  onReady: () => {},
                  setTitle: () => {},
                  close: () => {},
                  getUiStyle: () => {},
                  phoneCall: () => {}
              }

    const onReady = (callback: any) => {
        ZWJSBridge.onReady(() => {
            console.log('初始化完成后，执行bridge方法')
            callback()
        })
    }

    const ssoTicket = ZWJSBridge.ssoTicket as () => Promise<{ result: boolean; ticketId: string }>

    const setTitle = ZWJSBridge.setTitle as ({}: { title: string }) => Promise<any>

    const phoneCall = ZWJSBridge.phoneCall as ({ corpId }: { corpId: string }) => Promise<any>

    const close = ZWJSBridge.close as () => Promise<any>

    const getUiStyle = ZWJSBridge.getUiStyle as () => Promise<any>
    const zmAuthentication = ZWJSBridge.zmAuthentication as (props: {
        certName: string
        certNo: string
    }) => Promise<any>

    return {
        onReady,
        ssoTicket,
        setTitle,
        phoneCall,
        zmAuthentication,
        close,
        getUiStyle
    }
}
