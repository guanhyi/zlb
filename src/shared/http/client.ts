import { HttpClient as _HttpClient, type HttpInterceptor } from '@ngify/http'
import { Inject, Many } from '@wendellhu/redi'
import { HTTP_INTERCEPTOR, InterceptorService } from './interceptor'

export class NgHttp extends _HttpClient {
    constructor(
        @Many(HTTP_INTERCEPTOR)
        private readonly interceptors: HttpInterceptor[],
        @Inject(InterceptorService) private interceptorService: InterceptorService
    ) {
        interceptorService.setInterceptors(interceptors)

        super(interceptorService.interceptors)
    }
    get getInterceptors(): HttpInterceptor[] {
        return this.interceptors
    }
}
