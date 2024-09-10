export type IResponse<T = any> = {
    /**返回代码 0 失败 1 成功 注：当返回值为1的时候并不代理data一定有值。 */
    ret: number
    msg: string
    data: T
}

export type IResponseType<T = any> = {
    /**返回代码 0 失败 1 成功 注：当返回值为1的时候并不代理data一定有值。 */
    ret: number
    msg: string
    data: T
}
