import AppHeader from '@/components/AppSidebar/AppHeader'
import AppSidebar from '@/components/AppSidebar/AppSidebar'
import { SidebarProvider } from '@workspace/ui/components/sidebar'

const AppLayout = ({ children }) => {
    return (
        <SidebarProvider >
            <AppSidebar />
            <main className='min-h-screen w-full'>
                <AppHeader />
                {children}
            </main>
        </SidebarProvider>
    )
}

export default AppLayout