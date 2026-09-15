'use client'
import { sidebarNavLinks } from '@/constants'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@workspace/ui/components/breadcrumb'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const AppBreadCrumb = () => {
    const pathname = usePathname()

    const allRoutes = [
        ...sidebarNavLinks.navMain,
        ...sidebarNavLinks.navSecondary,
    ]

    const currentRoute = allRoutes.find(
        (route) => route.url === pathname
    )
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    {pathname === "/" ? (
                        <BreadcrumbPage>
                            لوحة التحكم
                        </BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink asChild>
                            <Link href="/">
                                لوحة التحكم
                            </Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
                {pathname !== "/" && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>
                                {currentRoute?.title || "صفحة"}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default AppBreadCrumb