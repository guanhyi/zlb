import { useCallback } from 'react'
import { useMount, useUnmount } from 'ahooks'
import { useZWJSBridge } from '@/shared/hooks/useZWJSBridge'
const addTag = () => {
    // console.log(111)
    //为当前导航页附加一个tag
    window.history.replaceState('hasHash', '', '')
}
export const CloseHome = () => {
    const { close } = useZWJSBridge()
    const back = useCallback((event: any) => {
        //@ts-ignore
        // window.history.pushState(null, null, document.URL)
        console.log(event, history.length, document.referrer, 'possssss')
        if (window.location.pathname.includes('/zf-fk/')) {
            return
        }

        if (window.location.pathname.includes('/sg-fk/')) {
            return
        }

        if (window.location.pathname.includes('/msbs/')) {
            return
        }
        // close()

        if (event.state || !document.referrer) {
            close()
        }

        // if (event.persisted || (window.performance && window.performance.navigation.type == 2)) {
        //     close()
        // }
    }, [])
    useMount(() => {
        // getUiStyle().then((res) => {
        //     console.log(res, "old")
        //     userStore.setOld(res.uiStyle === "elder")
        // })

        // n("/", { replace: true })

        //@ts-ignore
        window.history.pushState(null, null, document.URL)
        // window.location.replace(document.URL)
        window.addEventListener('hashchange', addTag, false)

        window.addEventListener('popstate', back, false)
    })

    useUnmount(() => {
        window.removeEventListener('popstate', back, false)
        window.removeEventListener('hashchange', addTag, false)
    })
    return <></>
}
