import type { Dependency } from '@wendellhu/redi'

import { NgHttp } from './client'
import { HTTP_INTERCEPTOR, InterceptorService, NoopInterceptor } from './interceptor'

export const HTTP_CLIENT = NgHttp

export const HttpModule = {
    forRoot: [
        [
            HTTP_INTERCEPTOR,
            {
                useClass: NoopInterceptor
            }
        ],
        [InterceptorService],
        [NgHttp]
    ] as Dependency[],
    forChild: [[NgHttp]] as Dependency[]
}
