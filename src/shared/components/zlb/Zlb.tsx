import { ZlbConfig } from '@/config'
import { useZlbStore } from '@/core/services/zlb.service'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ZlbOld } from './Old'

export const Zlb = () => {
    const { userId, userNick } = useZlbStore()
    const location = useLocation()

    const setup = () => {
        if (userId && userNick && ZlbConfig.miniAppId) {
            console.log(userId)
            //@ts-ignore
            const zwlog = new ZwLog({
                _user_id: userId,
                _user_nick: userNick
            })
            console.log(zwlog)

            zwlog.onReady(() => {
                //PV日志
                zwlog.sendPV({
                    t0: Math.random().toFixed(2),
                    t2: (Math.random() * 2).toFixed(2),
                    //             t0: Math.random(),
                    //             t2: Math.random() * 2,
                    pageId: decodeURI(location.pathname),
                    pageName: location.pathname,
                    miniAppId: ZlbConfig.miniAppId,
                    miniAppName: ZlbConfig.miniAppName,
                    log_status: '02',
                    _user_id: userId,
                    _user_nick: userNick
                })
                zwlog.record('yourTrackerEventCode', 'CLK', {
                    Test1: '测试参数 1'
                })
            })
        }
    }
    useEffect(() => {
        setup()
    }, [location, userId, userNick])

    return (
        <>
            <ZlbOld />
        </>
    )
}
