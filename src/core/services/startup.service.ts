import { Inject, createIdentifier } from '@wendellhu/redi'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { LoginService } from './login.service'
import { SysMenuService, useMenuStore } from './menu.service'
import { useAuthStore } from './auth.service'
// import { AccountService, useAccountStote } from './account.service'

// function getTokenLogin() {
//     //@ts-ignore
//     const reg = new RegExp('(^|&)' + 'token' + '=([^&]*)(&|$)', 'i')
//     return window.location.search.substr(1).match(reg)
// }
export class StartupService {
    constructor(
        @Inject(SysMenuService) public sysMenuService: SysMenuService,
        @Inject(LoginService) public loginService: LoginService
    ) {}
    mockLoad() {
        return new Observable((observer) => {
            observer.next({})
            observer.complete()
        })
    }
    proLoad() {
        return new Observable((obs) => {
            obs.next({})
            obs.complete()
        })
        // return new Observable((observer) => {})
    }

    noDDLoad() {
        return new Observable((obs) => {
            if (useAuthStore.getState().token) {
                this.sysMenuService.getAuthList().subscribe(([authButton, authRouter]) => {
                    // this.authService.setAuth(authButton.data)
                    // this.authService.setAuthMenuList(authRouter.data)
                    useAuthStore.setState({ authList: authButton.data })
                    useMenuStore.setState({ menu: this.sysMenuService.filterMenu(authRouter.data) })
                    // useAuthStore.setState
                })
            }
            obs.next()
            obs.complete()
        })
    }

    load(): Observable<any> {
        console.log(environment.type)
        return environment.type !== 'prod' ? this.noDDLoad() : this.proLoad()
    }
}

export const STARTUP_TOKEN = createIdentifier<StartupService>('STARTUP_TOKEN')
