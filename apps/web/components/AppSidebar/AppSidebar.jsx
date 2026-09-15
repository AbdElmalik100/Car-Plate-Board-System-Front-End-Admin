import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader } from '@workspace/ui/components/sidebar'
import NavMain from './NavMain'
import { sidebarNavLinks } from '@/constants'

const AppSidebar = () => {
    const {navMain, navSecondary} = sidebarNavLinks
    return (
        <Sidebar side='right'>
            <SidebarHeader className='text-center h-16 justify-center border-b'>
                <span className='text-2xl font-black'>Logo</span>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={navMain} />
                <SidebarGroup />
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

export default AppSidebar