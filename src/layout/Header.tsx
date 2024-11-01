import { LayoutBreadcrumb } from './_common/Breadcrumb'
import { LayoutConfig } from './config'

export const LayoutHeader = () => {
    return (
        <header
            className="w-full"
            style={{ height: LayoutConfig.HEADER_HEIGHT, borderBottom: `1px dashed #eee` }}
        >
            <div className="flex h-full flex-grow items-center justify-between px-4 text-gray backdrop-blur ">
                <div className="flex justify-center items-baseline">
                    <div className="ml-4 hidden md:block">
                        <LayoutBreadcrumb />
                    </div>
                </div>
            </div>
        </header>
    )
}
