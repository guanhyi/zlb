import { useAuthStore } from '@/core/services/auth.service'
import { useGrantRoleService } from '@/core/services/grant_role.service'
import { useRolesService } from '@/core/services/role.service'
import { CellList } from '@/shared/components/cellList'
import { Button } from 'antd-mobile'
import res from 'antd-mobile-icons/es/AaOutline'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const GrantRoleView = () => {
    const rolesService = useRolesService()
    const grantRoleService = useGrantRoleService()
    const [roles, setRoles] = useState<any[]>([])
    const [myRoles, setMyRoles] = useState<any>()
    const [isGrant, setIsGrant] = useState<boolean>(false)
    const n = useNavigate()
    const { user } = useAuthStore()
    const deleteGrant = () => {
        grantRoleService.deleteGrant(myRoles.id).subscribe((res) => {
            n('/my')
        })
    }
    useEffect(() => {
        rolesService.getMyRole().subscribe((res) => {
            setRoles(res.data)
        })
        grantRoleService.getMyGrant().subscribe((res: any) => {
            if (res.data) {
                setIsGrant(true)
                setMyRoles(res.data)
            } else {
                setIsGrant(false)
            }
        })
    }, [])
    return (
        <div className="bg-[#eff2fa] min-h-100vh">
            <div className="text-20px p-10px bg-[#fff]">授权管理</div>
            <div className="m-2">
                <CellList
                    data={roles}
                    columns={[
                        {
                            title: '我的权限',
                            dataIndex: '',
                            render: roles.map((e) => {
                                return <div>{e.name}</div>
                            })
                        },
                        { title: '授权状态', dataIndex: '', render: <div>未授权</div> }
                    ]}
                ></CellList>
                <CellList
                    data={myRoles}
                    columns={[
                        {
                            title: '授权人单位',
                            dataIndex: 'toUserIdOrg'
                        },
                        { title: '授权人姓名', dataIndex: 'toUserIdName' },
                        {
                            title: '授权开始时间',
                            dataIndex: '',
                            render: (
                                <div>
                                    {myRoles?.startTime
                                        ? dayjs(myRoles?.startTime).format('YYYY-MM-DD HH:mm:ss')
                                        : '-'}
                                </div>
                            )
                        },
                        {
                            title: '授权结束时间',
                            dataIndex: '',
                            render: (
                                <div>
                                    {myRoles?.endTime
                                        ? dayjs(myRoles?.endTime).format('YYYY-MM-DD HH:mm:ss')
                                        : '-'}
                                </div>
                            )
                        }
                    ]}
                ></CellList>
                {!isGrant ? (
                    <Button
                        onClick={() => {
                            n('/grant-role-form')
                        }}
                        className="mt-4"
                        color="primary"
                        block
                    >
                        去授权
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            deleteGrant()
                        }}
                        className="mt-4"
                        color="primary"
                        block
                    >
                        解除授权
                    </Button>
                )}
            </div>
        </div>
    )
}
