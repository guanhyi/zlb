type RemoteResultDTO<T> = {
    code: string
    data: T
    msg: string
    success: boolean
}
type PageRes<T> = {
    current: any
    pages: any
    records: T
    size: any
    total: any
}
type LoginDTO = {
    token: string
}

type CodeItem = {
    value: string
    label: string
}

/**
 * Entity的基础类
 */
interface BaseEntity {
    /**
     * id
     */

    id: string

    /**
     * 创建者
     */
    createBy: string

    /**
     * 创建时间
     */
    createTime: string

    /**
     * 更新者
     */
    updateBy: string

    /**
     * 更新时间
     */
    updateTime: string

    /**
     * 删除标记
     */
    deleted: number
}
