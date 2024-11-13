import { Zlb } from '@/shared/components/zlb/Zlb'
import { Outlet } from 'react-router-dom'

export const LayoutView = () => {
    return (
        <>
            <Zlb />
            <Outlet />
        </>
    )
}
