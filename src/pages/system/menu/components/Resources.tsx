import { SysMenuService, SysMenuVO } from '@/core/services/menu.service'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useDependency } from '@wendellhu/redi/react-bindings'
import { Button, Empty, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const TableStyled = styled.table`
    table-layout: fixed;
    border-collapse: separate;
    border: 1px solid rgb(235, 238, 245);
    border-width: 1px 0 0 1px;
    width: 98%;
    margin-bottom: 10px;

    .del_btn {
        display: none;
    }

    tr:hover {
        .del_btn {
            display: inline-block;
        }
        .btn_idx {
            display: none;
        }
    }

    td,
    th {
        padding: 0 10px;
        line-height: 40px;
        border-collapse: separate;

        border-right: 1px solid rgb(235, 238, 245);
        border-bottom: 1px solid rgb(235, 238, 245);
    }
    .ant-input {
        color: rgba(48, 49, 51, 0.88);
        font-weight: 400;
    }
`

const ButtonDel = styled(Button)`
    background-color: rgb(254, 240, 240) !important;
    color: rgb(245, 108, 108) !important;
    border: 1px solid rgb(250, 182, 182) !important;

    &:hover {
        background-color: rgb(245, 108, 108) !important;
        color: #fff !important;
        border: 1px solid rgb(245, 108, 108) !important;
    }
`

type P = {
    menuId?: string | number
    getData: (fun: () => Partial<SysMenuVO>[]) => void
}

export const MenuButtonResources: React.FC<P> = (props: P) => {
    const sysMenuService = useDependency(SysMenuService)
    const [buttonList, setButtonList] = useState<Partial<SysMenuVO>[]>([])

    useEffect(() => {
        if (!props.menuId) {
            setButtonList([])
            return
        }
        sysMenuService.buttons(props.menuId + '').then((res) => {
            setButtonList(res.data)
        })
    }, [props.menuId])

    const onKeyChange = (e: any, idx: number, key: 'title' | 'authority') => {
        if (!buttonList) {
            return
        }
        const { value: inputValue } = e.target
        const button = buttonList[idx]
        button[key] = inputValue
        setButtonList([...buttonList])
    }

    const onDelete = (idx: number) => {
        if (!buttonList) {
            return
        }
        buttonList.splice(idx, 1)
        setButtonList([...buttonList])
    }
    props.getData(() => {
        return [...buttonList]
    })

    return (
        <div className="ant-table-content">
            <TableStyled border={0} cellPadding={0} cellSpacing={0}>
                <colgroup>
                    <col width={60} />
                    <col width="150" />
                    <col />
                </colgroup>
                <thead>
                    <tr>
                        <th className="text-center">
                            <Button
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setButtonList([
                                        ...buttonList,
                                        {
                                            title: '',
                                            authority: ''
                                        }
                                    ])
                                }}
                                size="small"
                                shape="circle"
                                type="primary"
                            />
                        </th>
                        <th>按钮名称</th>
                        <th>授权标识</th>
                    </tr>
                </thead>
                <tbody>
                    {buttonList.length > 0 ? (
                        buttonList.map((button, idx) => {
                            return (
                                <tr key={idx}>
                                    <td className="text-center">
                                        <span className="btn_idx">{idx + 1}</span>
                                        <ButtonDel
                                            className="del_btn"
                                            icon={<DeleteOutlined />}
                                            onClick={() => {
                                                onDelete(idx)
                                            }}
                                            danger
                                            type="primary"
                                            size="small"
                                            shape="circle"
                                        />
                                    </td>
                                    <th>
                                        <Input
                                            onChange={(e) => {
                                                onKeyChange(e, idx, 'title')
                                            }}
                                            value={button.title}
                                        />
                                    </th>
                                    <th>
                                        <Input
                                            onChange={(e) => {
                                                onKeyChange(e, idx, 'authority')
                                            }}
                                            value={button.authority}
                                        />
                                    </th>
                                </tr>
                            )
                        })
                    ) : (
                        <tr>
                            <td colSpan={3}>
                                <div className="p-[10px]">
                                    <Empty />
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </TableStyled>
        </div>
    )
}
