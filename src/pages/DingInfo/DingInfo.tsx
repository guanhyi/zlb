import { DingInfoDTO, useDingInfoService } from '@/core/services/ding_info.service'
import { Button, CalendarPicker, CheckList, Modal } from 'antd-mobile'
import { useEffect, useRef, useState } from 'react'
import { CheckCircleFill, CheckCircleOutline, SmileOutline } from 'antd-mobile-icons'
import dayjs from 'dayjs'
import { PageList, PageRef } from '@/shared/components/PageList'
import { useParams } from 'react-router-dom'
import { useAuthStore } from '@/core/services/auth.service'
import { Observable } from 'rxjs'

export const DingInfo = () => {
    const { allClose } = useParams()

    const dingInfoService = useDingInfoService()
    const [dingInfoList, setDingInfoList] = useState<DingInfoDTO[]>([])
    const [visible, setVisible] = useState(false)
    const [chooseList, setChooseList] = useState<string[]>([])
    const { user } = useAuthStore()
    const handleReload = () => {
        if (pageListRef.current) {
            pageListRef.current.reload() // 调用 reload 方法
        }
    }
    const defaultRange: [Date, Date] = [dayjs().toDate(), dayjs().add(2, 'day').toDate()]
    useEffect(() => {}, [])
    const pageListRef = useRef<PageRef>(null)
    const close = () => {
        const form = {
            projectIdList: chooseList,
            startTime: defaultRange[0],
            endTime: defaultRange[1],
            userId: user.userId,
            allClose: allClose
        }
        dingInfoService.batchCreate(form).subscribe((res) => {
            if (res.data) {
                handleReload()
            }
        })
    }
    const open = () => {
        dingInfoService.deleteDingInfo(chooseList.join(',')).subscribe((res) => {
            console.log(res)
        })
    }

    const load = (params: { index: number; size: number; [key: string]: any }) => {
        return dingInfoService
            .getDingInfoPagedList({
                ...params,
                allClose: allClose
            })
            .then((res: any) => {
                return {
                    list: res.record,
                    total: res.total
                }
            })
    }
    return (
        <div>
            <div className=" bg-[#eff2fa] min-h-100vh">
                <div className="bg-#fff px-20px py-10px text-20px">
                    消息管理{allClose === '1' && <span>（发改）</span>}
                </div>
                <div className="flex m-20px">
                    <Button
                        className="mr-1"
                        color="warning"
                        block
                        onClick={() => {
                            if (chooseList.length !== 0) {
                                setVisible(true)
                            }
                        }}
                    >
                        关闭
                        <CalendarPicker
                            visible={visible}
                            defaultValue={defaultRange}
                            selectionMode="range"
                            onClose={() => setVisible(false)}
                            onMaskClick={() => setVisible(false)}
                            onConfirm={() => {
                                close()
                            }}
                            onChange={() => {}}
                        />
                    </Button>
                    <Button
                        onClick={() => {
                            if (chooseList.length !== 0) {
                                open()
                            }
                        }}
                        className="ml-1"
                        color="primary"
                        block
                    >
                        打开
                    </Button>
                </div>
                <div>
                    <PageList
                        ref={pageListRef}
                        // params={{ allClose: allClose }}
                        className="h-100vh"
                        request={(v) => {
                            return dingInfoService.getDingInfoPagedList({
                                ...v,
                                allClose: allClose
                            })
                        }}
                    >
                        {(page: any) => (
                            <CheckList
                                onChange={(v) => {
                                    setChooseList(v as string[])
                                }}
                                extra={(active) =>
                                    active ? <CheckCircleFill /> : <CheckCircleOutline />
                                }
                                multiple
                            >
                                {page.map((e: any) => {
                                    return (
                                        <CheckList.Item key={e.id} value={e.id}>
                                            <div className="bg-[#fff] p-5px">
                                                <div>{e.projectName}</div>
                                                <div className="flex text-13px mt-2">
                                                    <div
                                                        className={
                                                            e.isOpen
                                                                ? 'text-[#2b64e8]'
                                                                : 'text-[#FFA442]'
                                                        }
                                                    >
                                                        {e.isOpen === 1 ? '消息打开' : '消息关闭'}
                                                    </div>
                                                    <div className="ml-1">
                                                        消息关闭时间：
                                                        <span className="text-#999">
                                                            {e.endTime !== null
                                                                ? dayjs(e.endTime).format(
                                                                      'YYYY-MM-DD HH:ss'
                                                                  )
                                                                : '-'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CheckList.Item>
                                    )
                                })}
                            </CheckList>
                        )}
                    </PageList>

                    {/* <CheckList
                        onChange={(v) => {
                            
                        }}
                        extra={(active) => (active ? <CheckCircleFill /> : <CheckCircleOutline />)}
                        multiple
                    >
                        {dingInfoList.map((e) => {
                            return (
                                <CheckList.Item key={e.id} value={e.id}>
                                    <div className="bg-[#fff] p-5px">
                                        <div>{e.projectName}</div>
                                        <div className="flex text-13px mt-2">
                                            <div
                                                className={
                                                    e.isOpen ? 'text-[#2b64e8]' : 'text-[#FFA442]'
                                                }
                                            >
                                                消息打开
                                            </div>
                                            <div className="ml-1">
                                                消息关闭时间：
                                                <span className="text-#999">
                                                    {e.endTime !== null
                                                        ? dayjs(e.endTime).format(
                                                              'YYYY-MM-DD HH:ss'
                                                          )
                                                        : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CheckList.Item>
                            )
                        })}
                    </CheckList> */}
                </div>
            </div>
        </div>
    )
}
