import { useAuthStore } from '@/core/services/auth.service'
import { useGrantRoleService } from '@/core/services/grant_role.service'
import { useRolesService } from '@/core/services/role.service'
import { CellList } from '@/shared/components/cellList'
import { OrgPicker, OrgRef } from '@/shared/components/OrgPicker'
import { UserByOrgId } from '@/shared/components/UserByOrgId'
import { Button, DatePicker, DatePickerRef, Form } from 'antd-mobile'
import res from 'antd-mobile-icons/es/AaOutline'
import dayjs from 'dayjs'
import { RefObject, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const GrantRoleFormView = () => {
    const rolesService = useRolesService()
    const grantRoleService = useGrantRoleService()
    const { user } = useAuthStore()
    const [roles, setRoles] = useState<any[]>([])
    const [orgId, setOrgId] = useState<string>('')
    const n = useNavigate()
    const onFinish = (params: any) => {
        const form = {
            startTime: params.startTime,
            endTime: params.endTime,
            userId: user.userId,
            toUserId: params.toUserId
        }
        grantRoleService.createGrantRole(form).subscribe((res) => {
            if (res.data) {
                n('/my')
            }
        })
    }
    useEffect(() => {
        rolesService.getMyRole().subscribe((res) => {
            setRoles(res.data)
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">授权管理</div>
            <div className="m-2">
                <Form
                    className="mt-1"
                    name="form"
                    onFinish={onFinish}
                    style={{ '--border-top': 'none' }}
                    footer={
                        <div className="flex">
                            <Button
                                className="mr-2"
                                block
                                type="submit"
                                color="primary"
                                size="large"
                            >
                                提交
                            </Button>
                        </div>
                    }
                >
                    <Form.Item
                        onClick={(e, datePickerRef: RefObject<OrgRef>) => {
                            datePickerRef.current?.open()
                        }}
                        name="orgId"
                        label="授权人单位"
                        rules={[{ required: true }]}
                    >
                        <OrgPicker
                            onChange={(e) => {
                                setOrgId(e)
                            }}
                            multiple
                        ></OrgPicker>
                    </Form.Item>
                    <Form.Item
                        onClick={(e, datePickerRef: RefObject<OrgRef>) => {
                            datePickerRef.current?.open()
                        }}
                        name="toUserId"
                        label="授权人姓名"
                        disabled={!orgId}
                        rules={[{ required: true }]}
                    >
                        <UserByOrgId orgId={orgId}></UserByOrgId>
                    </Form.Item>
                    <Form.Item
                        name="startTime"
                        label="授权开始时间"
                        trigger="onConfirm"
                        onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                            datePickerRef.current?.open()
                        }}
                    >
                        <DatePicker>
                            {(value) => (value ? dayjs(value).format('YYYY-MM-DD') : '请选择日期')}
                        </DatePicker>
                    </Form.Item>
                    <Form.Item
                        name="endTime"
                        label="授权结束时间"
                        trigger="onConfirm"
                        onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                            datePickerRef.current?.open()
                        }}
                    >
                        <DatePicker>
                            {(value) => (value ? dayjs(value).format('YYYY-MM-DD') : '请选择日期')}
                        </DatePicker>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
