import { useAuthStore } from '@/core/services/auth.service'
import {
    StationMessageDTO,
    useStationMessageService
} from '@/core/services/station_message.service'
import { PageList, PageRef } from '@/shared/components/PageList'
import { Tabs, CapsuleTabs, Button, Modal } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'

export const StationMessageView = () => {
    const stationMessageService = useStationMessageService()
    const { user } = useAuthStore()
    const pageListRef = useRef<PageRef>(null)
    const [isRead, setIsRead] = useState<number | null>(null)
    const handleReload = () => {
        if (pageListRef.current) {
            pageListRef.current.reload() // 调用 reload 方法
        }
    }
    const allRead = () => {
        stationMessageService.allReadStationMessage().subscribe((res) => {
            if (!res.success) {
                handleReload()
            }
        })
    }
    useEffect(() => {
        // stationMessageService
        //     .getStationMessage({
        //         index: 1,
        //         size: 10
        //     })
        //     .subscribe()
    }, [])
    return (
        <div className="bg-[#eff2fa]">
            <div className="flex items-center px-20px">
                <CapsuleTabs
                    onChange={(isRead) => {
                        setIsRead(isRead === 'ALL' ? null : Number(isRead))
                    }}
                >
                    <CapsuleTabs.Tab title="全部" key="ALL"></CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="已读" key="1"></CapsuleTabs.Tab>
                    <CapsuleTabs.Tab title="未读" key="0"></CapsuleTabs.Tab>
                </CapsuleTabs>
                <div>
                    <Button
                        onClick={() => {
                            allRead()
                        }}
                        size="small"
                        color="primary"
                    >
                        全部已读
                    </Button>
                </div>
            </div>
            {
                <PageList
                    params={{ isRead: isRead }}
                    ref={pageListRef}
                    className="h-100vh"
                    request={stationMessageService.getStationMessagePagedList}
                >
                    {(page: any) =>
                        page.map((e: StationMessageDTO) => {
                            return (
                                <div
                                    onClick={() => {
                                        stationMessageService
                                            .readStationMessage(e.id)
                                            .subscribe(() => {
                                                handleReload()
                                            })
                                        Modal.show({
                                            header: <div className="text-20px">{e.sendTime}</div>,
                                            content: <div className="text-16px">{e.content}</div>,
                                            showCloseButton: true,
                                            closeOnMaskClick: true
                                        })
                                    }}
                                    key={e.id}
                                    className="bg-[#fff] py-15px px-12px  rounded-5px my-12px"
                                >
                                    <div className="flex justify-between items-center text-[15px] text-[#333]">
                                        <div className="truncate flex-1">{e.content}</div>
                                    </div>
                                    <div className="flex justify-between items-center mt-15px">
                                        <div
                                            className={`${
                                                e.isRead ? 'text-[#2864e8]' : 'text-[#FFA442]'
                                            } `}
                                        >
                                            {e.isRead ? '已读' : '未读'}
                                        </div>
                                        <div className="text-[13px] text-[#999]">{e.sendTime}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </PageList>
            }
        </div>
    )
}
