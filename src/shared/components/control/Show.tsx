import react from 'react'

type ShowProps<T> = {
    /**判断条件 */
    when: T | undefined | null | false
    /**当when为false时展示 */
    fallback?: react.ReactNode | undefined
    /**不删除dom节点 */
    notDelete?: boolean
    children: react.ReactNode | ((data: NonNullable<T>) => react.ReactNode)
}

export function Show<T>(props: ShowProps<T>) {
    const condition = react.useMemo<T | undefined | null | boolean>(() => {
        return props.when
    }, [props.when])

    const Children = (
        <>
            {typeof props.children === 'function'
                ? props.children(condition as NonNullable<T>)
                : props.children}
        </>
    )

    if (props.notDelete) {
        return (
            <>
                <div className={`${condition ? '' : 'hidden'}`}>{Children}</div>
                <div className={`${!condition ? '' : 'hidden'}`}>
                    {props.fallback && props.fallback}
                </div>
            </>
        )
    }

    if (condition) {
        return (
            <>
                {typeof props.children === 'function'
                    ? props.children(condition as NonNullable<T>)
                    : props.children}
            </>
        )
    }
    return <>{props.fallback && props.fallback}</>
}
