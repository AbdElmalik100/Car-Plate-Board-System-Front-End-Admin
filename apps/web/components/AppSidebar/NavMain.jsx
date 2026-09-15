'use client'
import { normalizePathname } from '@/utils'
import { Icon } from '@iconify/react'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@workspace/ui/components/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavMain = ({ items }) => {
    const pathname = usePathname()

    const isActive = (pathname, url) => {
        const current = normalizePathname(pathname)
        const target = normalizePathname(url)
        // if (target === '/app') return current === '/app'
        return current === target || current.startsWith(target + '/')
    }
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <Link href={item.url}>
                                <SidebarMenuButton tooltip={item.title} className={isActive(pathname, item.url) && 'bg-primary text-white hover:bg-primary hover:text-white'}>
                                    {item.icon && <Icon icon={item.icon} />}
                                    <span>{item.title}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export default NavMain