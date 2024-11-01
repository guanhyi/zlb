import { Inject, createIdentifier } from '@wendellhu/redi'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'

function getTokenLogin() {
    //@ts-ignore
    const reg = new RegExp('(^|&)' + 'token' + '=([^&]*)(&|$)', 'i')
    return window.location.search.substr(1).match(reg)
}
export class StartupService {
    proLoad() {
        return new Observable((obs) => {
            obs.next({})
            obs.complete()
        })
        // return new Observable((observer) => {})
    }
    mockLoad() {
        return new Observable((obs) => {
            obs.next({})
            obs.complete()
        })
    }

    load(): Observable<any> {
        return environment.type !== 'prod' ? this.mockLoad() : this.proLoad()
    }
}

export const STARTUP_TOKEN = createIdentifier<StartupService>('STARTUP_TOKEN')
