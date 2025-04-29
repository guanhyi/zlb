import { JSX, forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { ErrorBlock, Footer, Toast } from 'antd-mobile'
import { useSignal } from '@preact/signals-react'
import { Show } from './control/Show'
type Props<T = any> = {
    request: (params: {
        index: number
        size: number
        [key: string]: any
    }) => Promise<{ list: T[]; total: any }>
    children: (item: T[]) => JSX.Element
    size?: number
    params?: Partial<T>
    height?: number
    className?: string
    ref?: any
}

export type PageRef = {
    reload: () => void
}
function _PageList<T>({ ...props }: Props<T>, ref: React.Ref<PageRef | undefined>) {
    const listRef = useRef<HTMLDivElement>(null)
    const [list, setList] = useState<T[]>([])
    const [isNoMrom, setIsNoMrom] = useState<boolean>(false)
    const loading = useSignal(false)
    const total = useSignal(0)
    const pageConfig = useSignal<{
        index: number
        size: number
    }>({
        index: 1,
        size: props?.size || 10
    })
    useImperativeHandle(ref, () => ({ reload }))
    const reload = () => {
        load(true)
    }

    const params = useMemo(() => {
        return {
            ...pageConfig.value,
            ...props.params
        }
    }, [pageConfig.value, props.params])

    const load = (isAdd?: boolean) => {
        loading.value = true
        Toast.show({
            content: '加载中...',
            icon: 'loading',
            duration: 0
        })
        props
            .request({
                ...pageConfig.value,
                ...props.params
            })
            .then((res) => {
                total.value = parseInt(res.total)
                if (isAdd) {
                    setList(res.list)
                } else {
                    setList([...list, ...res.list])
                }
                loading.value = false
                Toast.clear()
            })
            .finally(() => {
                loading.value = false
                Toast.clear()
            })
    }
    useEffect(() => {
        pageConfig.value.index = 1
        total.value = 1
        listRef.current?.scrollTo(0, 0)
        setTimeout(() => {
            load(true)
        }, 100)
    }, [props.params])
    useEffect(() => {
        if (list.length >= total.value) {
            setIsNoMrom(true)
        } else {
            setIsNoMrom(false)
        }
    }, [list])
    const more = (scrollTop: number, scrollHeight: number, clientHeight: number) => {
        if (isNoMrom) {
            return
        }
        if (loading.value) {
            return
        }
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            pageConfig.value.index++
            load()
        }
    }

    // const children = useMemo(() => {
    //     return props.children(list || [])
    // }, [list])

    return (
        <div
            className={`${props.className} flex-1 overflow-auto px-20px`}
            ref={listRef}
            onScroll={(e) => {
                more(
                    e.currentTarget.scrollTop,
                    e.currentTarget.scrollHeight,
                    e.currentTarget.clientHeight
                )
            }}
        >
            <Show when={list.length === 0} fallback={props.children(list || [])}>
                <div
                    className="flex items-center justify-center"
                    style={{
                        height: props.height || 200 + 'px'
                    }}
                >
                    <ErrorBlock status="empty" description={<span>暂无数据</span>} />
                </div>
            </Show>
            <Show
                when={isNoMrom}
                fallback={<Footer style={{ background: 'transparent' }} label="加载更多"></Footer>}
            >
                <Footer style={{ background: 'transparent' }} label="没有更多了"></Footer>
            </Show>
        </div>
    )
}
export const PageList = forwardRef(_PageList) as <T>(
    props: Props<T> & { ref?: React.ForwardedRef<PageRef | undefined> }
) => ReturnType<typeof _PageList>
