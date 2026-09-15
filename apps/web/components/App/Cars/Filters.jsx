import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@workspace/ui/components/sheet'
import BaseButton from '../../Shared/BaseButton'
import DatePicker from '../../Shared/DatePicker'
import { Field, FieldLabel } from '@workspace/ui/components/field'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { format, parse } from 'date-fns'

const Filters = ({ isPending }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [filters, setFilters] = useState({
        from: null,
        to: null,
    })

    const hasFilters = filters.from || filters.to

    // Load filters from URL
    useEffect(() => {
        const from = searchParams.get('from_date')
        const to = searchParams.get('to_date')

        setFilters({
            from: from
                ? parse(from, 'yyyy-MM-dd', new Date())
                : null,

            to: to
                ? parse(to, 'yyyy-MM-dd', new Date())
                : null,
        })
    }, [searchParams])

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (filters.from) {
            params.set(
                'from_date',
                format(filters.from, 'yyyy-MM-dd')
            )
        } else {
            params.delete('from_date')
        }

        if (filters.to) {
            params.set(
                'to_date',
                format(filters.to, 'yyyy-MM-dd')
            )
        } else {
            params.delete('to_date')
        }

        // Reset pagination
        // params.set('p', '1')
        // params.delete('cursor')

        router.push(
            `${pathname}?${params.toString()}`,
            { scroll: false }
        )
    }

    const handleClearFilters = () => {
        const params = new URLSearchParams(searchParams.toString())

        params.delete('from_date')
        params.delete('to_date')

        // Reset pagination
        // params.set('p', '1')
        // params.delete('cursor')

        setFilters({
            from: null,
            to: null,
        })

        router.push(
            `${pathname}?${params.toString()}`,
            { scroll: false }
        )
    }

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="relative inline-flex">
                    <BaseButton
                        variant="outline"
                        title="فلتر"
                        icon="bi:filter"
                        disabled={isPending}
                    />
                    {hasFilters && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
                            {Number(!!filters.from) + Number(!!filters.to)}
                        </span>
                    )}
                </div>
            </SheetTrigger>

            <SheetContent>
                <SheetHeader>
                    <SheetTitle>فلتر</SheetTitle>
                    <SheetDescription>
                        اختر الفلتر المناسب لك
                    </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-4 p-4">
                    <Field>
                        <FieldLabel>التاريخ من</FieldLabel>
                        <DatePicker
                            date={filters.from}
                            setDate={(date) =>
                                handleFilterChange('from', date)
                            }
                        />
                    </Field>
                    <Field>
                        <FieldLabel>التاريخ الي</FieldLabel>
                        <DatePicker
                            date={filters.to}
                            setDate={(date) =>
                                handleFilterChange('to', date)
                            }
                        />
                    </Field>
                </div>
                <SheetFooter>
                    <BaseButton
                        title="تفعيل الفلتر"
                        onClick={handleApplyFilters}
                        isLoading={isPending}
                        disabled={isPending}
                    />
                    <BaseButton
                        variant="outline"
                        title="اعادة التعيين"
                        onClick={handleClearFilters}
                        disabled={isPending}
                    />
                    <SheetClose asChild>
                        <BaseButton
                            variant="outline"
                            title="الغاء"
                            disabled={isPending}
                        />
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default Filters