import { Inject, createIdentifier } from '@wendellhu/redi'
import { Observable } from 'rxjs'
import { environment } from '../../environments/environment'
import { type Router, ROUTER } from './router.service'

export class StartupService {
    constructor(@Inject(ROUTER) private routerService: Router) {}

    mockLoad() {
        console.log(this.routerService)

        return new Observable((observer) => {
            observer.next({})
            observer.complete()
        })
    }
    proLoad() {
        return new Observable((observer) => {})
    }

    load(): Observable<any> {
        return environment.type !== 'prod' ? this.mockLoad() : this.proLoad()
    }
}

export const STARTUP_TOKEN = createIdentifier<StartupService>('STARTUP_TOKEN')
