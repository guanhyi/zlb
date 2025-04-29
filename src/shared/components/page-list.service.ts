import { usePagination } from 'ahooks'

export class PageListService {
    private _paginationReturn!: ReturnType<typeof usePagination>

    get paginationReturn() {
        return this._paginationReturn
    }

    setPaginationReturn(v: ReturnType<typeof usePagination>) {
        this._paginationReturn = v
    }
}
