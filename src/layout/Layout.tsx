import { LayoutHeader } from './Header'
import { Main } from './Main'
import { LayoutNav } from './Nav'

export const Layout = () => {
    return (
        <>
            <div className="flex h-screen overflow-hidden ">
                <LayoutNav />

                <div className="w-full">
                    <LayoutHeader />
                    <Main />
                </div>
            </div>
        </>
    )
}
