import { Dependency } from '@wendellhu/redi'
import { STARTUP_TOKEN, StartupService } from './services/startup.service'
import { HttpModule } from '../shared/http'
import { HTTP_INTERCEPTOR } from '../shared/http/interceptor'
import { DefaultInterceptor } from './net/default'
import { ErrorInterceptor } from './net/error'

import { AuthInterceptor } from './net/auth'
import { LoginService } from './services/login.service'
import { ACLService } from './services/acl.service'

export const RootProvider: Dependency<any>[] = [
    ...HttpModule.forRoot,
    [ACLService],
    [LoginService],
    [HTTP_INTERCEPTOR, { useClass: DefaultInterceptor }],
    [HTTP_INTERCEPTOR, { useClass: AuthInterceptor }],
    [HTTP_INTERCEPTOR, { useClass: ErrorInterceptor }],
    [STARTUP_TOKEN, { useClass: StartupService }]
]
