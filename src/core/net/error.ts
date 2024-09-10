import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@ngify/http'
import { Inject } from '@wendellhu/redi'
import { Toast } from 'antd-mobile'
import { Observable, catchError, mergeMap, of, throwError } from 'rxjs'
import { ROUTER, type RouterType } from '../services/router.service'

export class ErrorInterceptor implements HttpInterceptor {
    constructor(@Inject(ROUTER) public router: RouterType) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            mergeMap((event) => {
                if (event instanceof HttpResponse) {
                    if (event.body.status === 0) {
                        // if (event.body.errDetail) {
                        //     Toast.show({
                        //         icon: 'fail',
                        //         content: event.body.errDetail
                        //     })
                        // } else {
                        //     Toast.show({
                        //         icon: 'fail',
                        //         content: '登录错误'
                        //     })
                        // }
                        Toast.show({
                            icon: 'fail',
                            content: event.body.msg
                        })
                        this.router.navigate('/')
                        // notification.error({
                        //     message: event.body.msg,
                        //     duration: 3
                        // })
                        return throwError(() => event)
                    }
                    if (event.status !== 200) {
                        return throwError(() => event)
                    }
                }
                return of(event)
            }),
            catchError((err: HttpErrorResponse) => {
                if (err.error && err.error.status !== 200) {
                    switch (err.error.status) {
                        case 401:
                            Toast.show({
                                icon: 'fail',
                                content: 'token过期或者暂无访问权限'
                            })

                        default:
                            Toast.show({
                                icon: 'fail',
                                content: '出错了'
                            })
                    }
                }

                return throwError(() => err)
            })
        )
        // return next.handle(request).pipe()
    }
}
