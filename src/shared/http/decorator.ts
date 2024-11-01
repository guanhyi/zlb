import { Subject, lastValueFrom, tap } from 'rxjs'

import { signal } from '@preact/signals-react'

import { Inject } from '@wendellhu/redi'
import { z } from 'zod'
import { HTTP_CLIENT } from '.'
import { NgHttp } from './client'

import { switchLoading } from '../operator/switch-loading'
import { ActionType } from '@ant-design/pro-components'
import { FormInstance } from 'antd/lib'
const BaseAuthList = ['add', 'page', 'update', 'del', 'delete', 'detail', 'create']
type BaseAuthType = 'add' | 'page' | 'update' | 'del' | 'delete' | 'detail' | 'create'

/**
 * 基础的请求loading处理
 */
export class BaseLoading {
    loading = signal(false)

    requestChangeLoading<T>() {
        return switchLoading<T>(this.loading)
    }
}

export class BaseCurd<T extends object, CodeType = any, AuthType extends string = BaseAuthType> {
    basePath = ''
    path = ''
    method = 'POST'
    listPath = ''

    requestLoading = new BaseLoading()

    findLoading = new BaseLoading()

    saveLoading = new BaseLoading()

    addLoading = new BaseLoading()

    deleteLoading = new BaseLoading()

    loading = signal(false)

    provideAuth = {
        add: '',
        page: '',
        update: '',
        delete: '',
        create: '',
        del: ''
    } as {
        [key in AuthType | BaseAuthType]: string
    }

    constructor(@Inject(HTTP_CLIENT) public _http: NgHttp) {
        const baseData = setParam(this)

        this.path = `${baseData.baseUrl}`
        this.listPath = `${this.path}/page`
        if (baseData.listPath) {
            this.listPath = `${this.path}${baseData.listPath}`
            this.method = baseData.method
        }

        if (baseData.codeEnum) {
            const codeEnum = baseData.codeEnum as string
            codeEnum.split(',').map((item) => {
                //@ts-ignore
                this.codeEnum.value[item] = []
            })
        }
        if (baseData.authMouthName) {
            const codeEnum = baseData.authMouthName as string
            if (baseData.otherAuthList) {
                this.scanAuth(codeEnum, this.provideAuth, baseData.otherAuthList)
            } else {
                this.scanAuth(codeEnum, this.provideAuth)
            }
        }
    }
    private scanAuth(authMouthName: string, authList: any, otherAuthList?: string[]) {
        BaseAuthList.map((item) => {
            authList[item] = `${authMouthName}.${item}`
        })
        if (otherAuthList) {
            otherAuthList?.map((item) => {
                authList[item] = `${authMouthName}.${item}`
            })
        }
    }
    setCurdTable = (table: ActionType) => {
        this.curdTable = table
    }
    setCurdForm = (form: FormInstance<T>) => {
        console.log(form)

        // this.curdForm = form
    }
    curdForm!: FormInstance<T>
    curdTable!: ActionType

    leadingOut: string = 'LeadingOut'

    /**摊平数据 */
    flattenItems = (items: any[], key: string) => {
        return items.reduce((flattenedItems, item) => {
            flattenedItems.push(item)
            if (Array.isArray(item[key])) {
                flattenedItems = flattenedItems.concat(this.flattenItems(item[key], key))
            }
            return flattenedItems
        }, [])
    }
    delete = (id: any) => {
        return this._http
            .delete<RemoteResultDTO<any>>(`${this.path}/delete`, { id })
            .pipe(this.deleteLoading.requestChangeLoading())
    }

    del = (id: any) => {
        return this._http
            .delete<RemoteResultDTO<any>>(`${this.path}/delete`, { id })
            .pipe(this.deleteLoading.requestChangeLoading())
    }
    did = (id: any) => {
        return this._http
            .post<RemoteResultDTO<any>>(`${this.path}/del`, [id])
            .pipe(this.deleteLoading.requestChangeLoading())
    }
    deleteId = (id: any) => {
        return this._http
            .delete<RemoteResultDTO<any>>(`${this.path}/${id}`)
            .pipe(this.deleteLoading.requestChangeLoading())
    }
    add = (form: any) => {
        return this._http
            .post<RemoteResultDTO<any>>(`${this.path}/create`, form)
            .pipe(this.addLoading.requestChangeLoading())
    }

    newSand = (form: any) => {
        return this._http
            .post<RemoteResultDTO<any>>(`${this.path}/add`, form)
            .pipe(this.addLoading.requestChangeLoading())
    }

    save = (data: any) => {
        return this._http
            .put<RemoteResultDTO<any>>(`${this.path}/update`, {
                ...data
            })
            .pipe(this.saveLoading.requestChangeLoading())
    }
    list = (pageConfig: any) => {
        return this._http
            .get<RemoteResultDTO<T[]>>(`${this.path}/list`, {
                ...pageConfig
            })
            .pipe(this.findLoading.requestChangeLoading())
    }
    find = (id: string) => {
        return this._http
            .get<RemoteResultDTO<T>>(`${this.path}/${id}`)
            .pipe(this.findLoading.requestChangeLoading())
    }

    detail = (id: string) => {
        return this._http.get<RemoteResultDTO<T>>(`${this.path}/get?id=${id}`)
    }

    page = (pageConfig: any) => {
        return this._http.post<RemoteResultDTO<PageRes<T[]>>>(this.listPath, {
            ...pageConfig
        })
    }
    getPage = (pageConfig: any) => {
        return this._http.get<RemoteResultDTO<PageRes<T[]>>>(this.listPath, {
            ...pageConfig
        })
    }

    proPage = async ({ current, pageSize, ...pageConfig }: any) => {
        const newPageConfig = {
            pageNo: current,
            pageSize: pageSize,
            ...pageConfig
        }
        console.log(this.listPath)

        const pageData = await lastValueFrom(
            this.method === 'POST' ? this.page(newPageConfig) : this.getPage(newPageConfig)
        )
        const pageDataModule = z
            .object({
                records: z.array(z.any()).default([]),
                total: z.any().default(0)
            })
            .parse(pageData.data)
        return {
            data: pageDataModule.records,
            total: pageDataModule.total
        }
    }

    // add = (form: any) => {
    //     return this._http
    //         .post<RemoteResultDTO<any>>(`${this.path}/Add`, form)
    //         .pipe(this.addLoading.requestChangeLoading())
    // }

    // find = (uuid: any) => {
    //     return this._http
    //         .get<API.RemoteResultDTO<T>>(`${this.path}/Find`, {
    //             uuid
    //         })
    //         .pipe(this.findLoading.requestChangeLoading())
    // }
    // page = (pageConfig: any) => {
    //     return this._http.get<API.RemoteResultDTO<API.PageDTO<T[]>>>(`${this.path}/GetList`, {
    //         ...pageConfig
    //     })
    // }

    // proPage = async ({ current, pageSize, ...pageConfig }: any) => {
    //     const newPageConfig = {
    //         page: current,
    //         limit: pageSize,
    //         ...pageConfig
    //     }

    //     const pageData = await lastValueFrom(this.page(newPageConfig))
    //     return { ...pageData.result }
    // }

    // save = (data: any) => {
    //     return this._http
    //         .post<API.RemoteResultDTO<any>>(`${this.path}/Edit`, {
    //             ...data
    //         })
    //         .pipe(this.saveLoading.requestChangeLoading())
    // }
    // del = (uuid: string) => {
    //     return this._http
    //         .post<API.RemoteResultDTO<any>>(`${this.path}/Delete`, { uuid })
    //         .pipe(this.deleteLoading.requestChangeLoading())
    // }

    downloadSimple(url: string) {
        const anchor = document.createElement('a')
        const fileName = url.split('/').pop()?.split('?')[0]
        if ('download' in anchor) {
            //html5 A[download]
            anchor.href = url
            anchor.setAttribute('download', fileName || '')
            anchor.className = 'download-js-link'
            anchor.innerHTML = 'downloading...'
            anchor.style.display = 'none'
            document.body.appendChild(anchor)
            setTimeout(function () {
                anchor.click()
                document.body.removeChild(anchor)
            }, 66)
            return true
        }
        return true
    }
}

const paramKey = `__api_params`
const CACHE_SIZE = 1
function setParam(target: any, key: string = paramKey): any {
    let params = target[key]
    if (typeof params === 'undefined') {
        params = target[key] = {}
    }
    return params
}

/**
 * 默认基准URL
 * - 有效范围：类
 */
export function BaseUrl(url: string, options?: { codeEnum: string }) {
    return function <TClass extends new (...args: any[]) => BaseCurd<any>>(target: TClass): TClass {
        const params = setParam(target.prototype)

        params.baseUrl = url
        if (options && options.codeEnum) {
            params.codeEnum = options.codeEnum
        }

        return target
    }
}
export function BaseCode(code: string) {
    return function <TClass extends new (...args: any[]) => BaseCurd<any>>(target: TClass): TClass {
        const params = setParam(target.prototype)

        params.codeEnum = code

        return target
    }
}
export function BaseListPath(url: string, method: 'POST' | 'GET' = 'POST') {
    return function <TClass extends new (...args: any[]) => BaseCurd<any>>(target: TClass): TClass {
        const params = setParam(target.prototype)
        params.listPath = url
        params.method = method
        return target
    }
}

export function BaseAuth(MouthName: string, otherAuthList?: string[]) {
    return function <TClass extends new (...args: any[]) => BaseCurd<any, any, any>>(
        target: TClass
    ): TClass {
        const params = setParam(target.prototype)
        params.authMouthName = MouthName
        params.otherAuthList = otherAuthList

        return target
    }
}
