'use client'
import { Columns } from "@/components/App/Representatives/RepresentativesListColumns"
import RepresentativeForm from "@/components/App/Representatives/RepresentativeForm"
import RepresentativesListTab from "@/components/App/Representatives/RepresentativesListTab"
import { DataTable } from "@/components/Shared/DataTable"
import EmptyState from "@/components/Shared/EmptyState"
import Heading from "@/components/Shared/Heading"
import Search from "@/components/Shared/Search"
import { useGetRepresentatives } from "@/hooks/useRepresentatives"
import { Icon } from "@iconify/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import LoginSessionsTab from "@/components/App/Representatives/LoginSessionsTab"

const Representatives = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [tab, setTab] = useState('representatives')

    const createQueryString = useCallback((name, value) => {
        const params = new URLSearchParams(searchParams.toString())
        params.delete('agenda')
        params.set(name, value)
        return params.toString()
    }, [searchParams])

    const onTabChange = (value) => {
        router.push(`${pathname}?${createQueryString('tab', value)}`, { scroll: false })
    }
    useEffect(() => {
        const tab = searchParams?.get('tab') || 'representatives-list'
        setTab(tab)
    }, [searchParams])
    return (
        <div className='p-6 min-h-screen'>
            <Tabs
                dir="rtl"
                defaultValue={tab}
                className="w-full"
                value={tab}
                onValueChange={onTabChange}
            >
                <div className="border-b w-full mb-6">
                    <TabsList variant={'line'}>
                        <TabsTrigger value="representatives-list">
                            <Icon icon={'fluent:people-list-20-filled'} />
                            قائمة المناديب
                        </TabsTrigger>
                        <TabsTrigger value="login-sessions">
                            <Icon icon={'bitcoin-icons:key-filled'} />
                            جلسات تسجيل الدخول
                        </TabsTrigger>
                    </TabsList>
                </div>
                <RepresentativesListTab />
                <LoginSessionsTab />
            </Tabs>
        </div>
    )
}

export default Representatives