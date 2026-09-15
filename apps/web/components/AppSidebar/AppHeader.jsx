import { Separator } from '@workspace/ui/components/separator'
import { SidebarTrigger } from '@workspace/ui/components/sidebar'
import UserProfile from '../Shared/UserProfile'
import AppBreadCrumb from './AppBreadCrumb'

const AppHeader = () => {
    return (
        <header className="flex h-16 shrink-0 px-6 justify-between border-b items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="self-center! data-[orientation=vertical]:h-4"
                />
                <AppBreadCrumb />
            </div>
            <UserProfile />
        </header>
    )
}

export default AppHeader