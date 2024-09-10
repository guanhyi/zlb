import { Children, cloneElement, useCallback, useMemo } from 'react'
import { MatchProps } from './Match'

type Props = {
    children: React.ReactNode
    fallback?: React.ReactNode
    // when: boolean
}

export function Switch(props: Props) {
    let keyed = false

    const recursiveGetChildren = useCallback(() => {
        let children = props.children as React.ReactElement<MatchProps<any>>
        let result: any[] = [-1]
        Children.forEach(children, (child, index) => {
            //@ts-ignore
            if (child && child.type.displayName === 'ControlMatch') {
                let cond = cloneElement(child)
                let c = cond.props.when
                if (c) {
                    // keyed = !!conds[i].keyed
                    result = [index, c, cond]
                }
            }
        })

        return result
    }, [props.children])

    return useMemo(() => {
        const [index, when, cond] = recursiveGetChildren()

        if (index < 0) return props.fallback

        const c = cond as React.ReactNode

        return c
    }, [props.children])
}
