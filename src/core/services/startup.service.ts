import { Inject, createIdentifier } from '@wendellhu/redi'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
// import { AccountService, useAccountStote } from './account.service'

// function getTokenLogin() {
//     //@ts-ignore
//     const reg = new RegExp('(^|&)' + 'token' + '=([^&]*)(&|$)', 'i')
//     return window.location.search.substr(1).match(reg)
// }
export class StartupService {
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

    load(): Observable<any> {
        console.log(environment.type)
        return environment.type !== 'prod' ? this.mockLoad() : this.proLoad()
    }
}

export const STARTUP_TOKEN = createIdentifier<StartupService>('STARTUP_TOKEN')
