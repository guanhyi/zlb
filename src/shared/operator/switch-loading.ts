import { Signal } from '@preact/signals-react'
import { Observable, catchError, finalize, throwError } from 'rxjs'

export function switchLoading<T>(
    loading: Signal<boolean>
): (source: Observable<T>) => Observable<T> {
    loading.value = true

    return (source: Observable<T>) =>
        source.pipe(
            catchError((err) => {
                loading.value = false
                return throwError(() => err)
            }),
            finalize(() => (loading.value = false))
        )
}
