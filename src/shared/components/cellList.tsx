import { List } from 'antd-mobile'
import { ReactNode } from 'react'
import { Show } from './control/Show'

export const CellList = (props: {
    data: any
    columns: {
        title: string
        dataIndex: string
        render?: ReactNode
        isHide?: boolean
        onClick?: () => void
    }[]
}) => {
    return (
        <>
            <List>
                {props.columns
                    .filter((item) => item.isHide !== true)
                    .map((item, index) => {
                        return (
                            <List.Item
                                key={index}
                                onClick={item.onClick}
                                extra={
                                    <Show
                                        when={item.render}
                                        fallback={
                                            <div className="py-2">
                                                {props.data && props.data[item.dataIndex]}
                                            </div>
                                        }
                                    >
                                        <div className="py-2"> {item.render}</div>
                                    </Show>
                                }
                            >
                                {item.title}
                            </List.Item>
                        )
                    })}
            </List>
        </>
    )
}
