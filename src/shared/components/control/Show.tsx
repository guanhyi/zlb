import react from 'react'

type ShowProps<T> = {
    /**判断条件 */
    when: T | undefined | null | false
    /**当when为false时展示 */
    fallback?: react.ReactNode | undefined
    /**不删除dom节点 */
    notDelete?: boolean
}

export function Show<T>(props: react.PropsWithChildren<ShowProps<T>>) {
    const condition = react.useMemo<T | undefined | null | boolean>(() => {
        return props.when
    }, [props.when])

    if (props.notDelete) {
        return (
            <>
                <div className={`${condition ? '' : 'hidden'}`}>{props.children}</div>
                <div className={`${!condition ? '' : 'hidden'}`}>
                    {props.fallback && props.fallback}
                </div>
            </>
        )
    }

    if (condition) {
        return <>{props.children}</>
    }
    return <>{props.fallback && props.fallback}</>
}
