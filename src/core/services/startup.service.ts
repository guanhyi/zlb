import { Inject, createIdentifier } from '@wendellhu/redi'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { LoginService } from './login.service'
import { useAuthStore } from './auth.service'
import dd from 'gdt-jsapi'
import { ACLService } from './acl.service'
function getTokenLogin() {
    //@ts-ignore
    const reg = new RegExp('(^|&)' + 'token' + '=([^&]*)(&|$)', 'i')
    return window.location.search.substr(1).match(reg)
}
export class StartupService {
    constructor(
        @Inject(LoginService) public loginService: LoginService,
        @Inject(ACLService) public aclService: ACLService
    ) {}
    proLoad() {
        return new Observable((obs) => {
            dd.ready(() => {
                dd.getAuthCode({})
                    .then((res) => {
                        this.loginService
                            .appSso(res.auth_code || res.code || '')
                            .subscribe((user) => {
                                useAuthStore.setState({ token: user.data.token, user: user.data })
                                this.loginService.getMyResources().subscribe((res) => {
                                    this.aclService.setAbilities(
                                        res.data.map((it: any) => it.linkUrl) || []
                                    )
                                })
                                obs.next({})
                                obs.complete()
                            })
                    })
                    .catch((err) => {})
            })
        })
        // return new Observable((observer) => {})
    }
    mockLoad() {
        return new Observable((obs) => {
            this.loginService
                .accountLogin({ account: '13957087531', password: 'aaeac980ed8717ad' }) // 18272874631 13957087531
                .subscribe((res) => {
                    useAuthStore.setState({ token: res.data.token, user: res.data })
                    this.loginService.getMyResources().subscribe((res) => {
                        this.aclService.setAbilities(res.data.map((it: any) => it.linkUrl) || [])
                    })
                    obs.next({})
                    obs.complete()
                })
        })
    }

    loginById(id: string) {
        return new Observable((obs) => {
            this.loginService.appLoginId(id).subscribe((res) => {
                useAuthStore.setState({ token: res.data.token, user: res.data })
                this.loginService.getMyResources().subscribe((res) => {
                    this.aclService.setAbilities(res.data.map((it: any) => it.linkUrl) || [])
                })
                obs.next({})
                obs.complete()
            })
        })
    }

    load(): Observable<any> {
        return environment.type !== 'prod' ? this.mockLoad() : this.proLoad()
    }
}

export const STARTUP_TOKEN = createIdentifier<StartupService>('STARTUP_TOKEN')
