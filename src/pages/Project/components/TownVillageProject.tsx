import { useAuthStore } from '@/core/services/auth.service'
import { ProjectDTO, TownVillageDTO, useProjectService } from '@/core/services/project.service'
import { PageList, PageRef } from '@/shared/components/PageList'
import { RefObject, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteImg from '../img/favorite.png'
import UnfavoriteImg from '../img/unfavorite.png'
import {
    Button,
    DatePicker,
    DatePickerRef,
    Ellipsis,
    Form,
    Input,
    Picker,
    PickerRef
} from 'antd-mobile'
import { OrgRef, OrgPicker } from '@/shared/components/OrgPicker'
import dayjs from 'dayjs'

export const TownVillageProjectList = () => {
    const n = useNavigate()
    const pageListRef = useRef<PageRef>(null)
    const projectService = useProjectService()

    const { user } = useAuthStore()
    const [searchParams, setSearchParams] = useState({
        townVillageType: 0,
        year: dayjs().subtract(1, 'month').format('YYYY-MM')
    })

    const search = (params: any) => {
        if (params.townVillageType) {
            params.townVillageType = params.townVillageType[0]
        }
        if (params.year) {
            params.year = dayjs(params.year).format('YYYY-MM')
        }
        setSearchParams(params)
    }
    const handleReload = () => {
        if (pageListRef.current) {
            pageListRef.current.reload() // 调用 reload 方法
        }
    }
    return (
        <div>
            <Form
                layout="horizontal"
                onFinish={search}
                footer={
                    <div className="flex items-center justify-center">
                        <div className="flex flex-1 mr-2">
                            <Button block type="submit" color="primary">
                                提交
                            </Button>
                        </div>
                    </div>
                }
            >
                <Form.Item
                    trigger="onConfirm"
                    onClick={(e, pickerRef: RefObject<PickerRef>) => {
                        pickerRef.current?.open()
                    }}
                    name="townVillageType"
                    label="项目类型"
                    initialValue={[0]}
                >
                    <Picker
                        columns={[
                            [
                                { label: '村主任项目', value: 0 },
                                { label: '乡镇长项目', value: 1 }
                            ]
                        ]}
                        defaultValue={[0]}
                    >
                        {(items) => {
                            if (items.every((item) => item === null)) {
                                return '请选择项目类型'
                            }
                            return items.map((item) => item?.label).join(' - ')
                        }}
                    </Picker>
                </Form.Item>
                <Form.Item
                    name="year"
                    label="年月"
                    trigger="onConfirm"
                    initialValue={dayjs().subtract(1, 'month').toDate()}
                    onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                        datePickerRef.current?.open()
                    }}
                >
                    <DatePicker
                        defaultValue={dayjs().subtract(1, 'month').toDate()}
                        precision="month"
                    >
                        {(value) => (value ? dayjs(value).format('YYYY-MM') : '请选择年月')}
                    </DatePicker>
                </Form.Item>
            </Form>
            {
                <PageList
                    ref={pageListRef}
                    params={searchParams}
                    className="h-100vh"
                    request={projectService.getTownVillagePagedList}
                >
                    {(page: any) =>
                        page.map((e: TownVillageDTO) => {
                            return (
                                <div
                                    key={e.id}
                                    className="bg-[#fff] py-15px px-12px  rounded-5px my-12px"
                                >
                                    <div className="flex justify-between items-center text-[15px] text-[#333]">
                                        <div className="truncate flex-1">{e.projectName}</div>
                                    </div>
                                    <div className="flex justify-between items-center mt-15px">
                                        <div className="text-[13px] text-[#999]">
                                            投资进度：{e.completeInvestment}/{e.totalInvestment}
                                            万元
                                        </div>
                                    </div>
                                    <div className="flex justify-between  mt-16px py-11px px-12px bg-[#F8F8F8]">
                                        <div className=" flex text-13px items-center">
                                            <div className="text-20px text-[#2b64e8] mr-[5px]">
                                                ·
                                            </div>
                                            <div className="text-[#999]">牵头实施人：</div>
                                            <Ellipsis
                                                direction="end"
                                                content={e.inChargeMember}
                                                className="text-[#2b64e8]"
                                            ></Ellipsis>
                                        </div>
                                        <div className="flex text-13px items-center">
                                            <div className=" text-20px text-[#14bf50] mr-[5px]">
                                                ·
                                            </div>
                                            <div className="text-[#999]">状态：</div>
                                            <div className="text-[#14bf50]">{e.status}</div>
                                        </div>
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
