import React from 'react'

export type MatchProps<T> = {
    when: T
    children: React.ReactNode | ((data: NonNullable<T>) => React.ReactNode)
}

export function Match<T>(props: MatchProps<T>) {
    if (typeof props.children === 'function') {
        return props.children(props.when as NonNullable<T>)
    }

    return props.children
}

Match.displayName = 'ControlMatch'
