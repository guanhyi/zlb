import { forwardRef, memo } from 'react'
import SimpleBar, { type Props as SimplebarProps } from 'simplebar-react'

export const Scrollbar = memo(
    forwardRef<HTMLElement, SimplebarProps>(({ children, ...other }, ref) => {
        return (
            <SimpleBar
                className="h-full"
                scrollableNodeProps={{ ref }}
                clickOnTrack={false}
                {...other}
            >
                {children}
            </SimpleBar>
        )
    })
)
