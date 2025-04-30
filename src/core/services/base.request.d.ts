declare namespace BaseRequestAPI {
    type RemoteResultDTO<T> = {
        //数据
        data: T
        //状态
        code: number

        // 返回提示
        msg: string
    }
    type PageDTO<T> = {
        records: T
        total: number
        pages: number
        current: number
        size: number
    }
    type LoginDTO = {
        token: string
    }
    type dept = {
        department_id: any
        department_name: any
    }
    type BaseParam = {
        /**主键 */
        uuid: any
    }
}
