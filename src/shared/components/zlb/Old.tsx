import { useZlbStore } from '@/core/services/zlb.service'
import { useZWJSBridge } from '@/shared/hooks/useZWJSBridge'
import { useMount } from 'ahooks'

export const ZlbOld = () => {
    const { setOld, old } = useZlbStore()
    const { getUiStyle } = useZWJSBridge()
    useMount(() => {
        getUiStyle().then((res) => {
            setOld(res.uiStyle === 'elder')
            document.documentElement.setAttribute(
                'data-theme',
                res.uiStyle === 'elder' ? 'old' : 'base'
            )
        })
    })

    return <></>
}
