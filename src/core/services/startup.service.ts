import { Inject, createIdentifier } from '@wendellhu/redi'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { AccountService, useAccountStote } from './account.service'

function getTokenLogin() {
    //@ts-ignore
    const reg = new RegExp('(^|&)' + 'token' + '=([^&]*)(&|$)', 'i')
    return window.location.search.substr(1).match(reg)
}
export class StartupService {
    constructor(@Inject(AccountService) public account: AccountService) {}
    mockLoad() {
        return new Observable((observer) => {
            const tokenArr = getTokenLogin()

            let token = tokenArr ? tokenArr[2] : ''
            this.account.zltSso(token).subscribe((res) => {
                useAccountStote.setState({
                    state: res.data
                })
                observer.next({})
                observer.complete()
            })
        })
    }
    proLoad() {
        return new Observable((obs) => {
            window.zlt_cdk.ready().then(() => {
                console.log(window.zlt_cdk)
                let ticket = window.zlt_cdk.getToken()
                this.account.zltSso(ticket).subscribe((res) => {
                    useAccountStote.setState({
                        state: res.data
                    })
                    obs.next({})
                    obs.complete()
                })
            })
        })
        // return new Observable((observer) => {})
    }

    load(): Observable<any> {
        console.log(environment.type)
        return environment.type !== 'prod' ? this.mockLoad() : this.proLoad()
    }
}

export const STARTUP_TOKEN = createIdentifier<StartupService>('STARTUP_TOKEN')
