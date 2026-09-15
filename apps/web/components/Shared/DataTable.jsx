"use client"
import { useTable } from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@workspace/ui/components/table"
import BaseButton from "./BaseButton"
// import { features, type DataTableFeatures } from "./data-table-features"
import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_includesString,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_text,
    tableFeatures,
} from "@tanstack/react-table"
import { Icon } from "@iconify/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function DataTable({ columns, data, isPending, meta }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [sorting, setSorting] = useState([])


    const table = useTable({
        data,
        columns,
        features: tableFeatures({
            columnFilteringFeature,
            columnVisibilityFeature,
            rowPaginationFeature,
            rowSelectionFeature,
            // rowSortingFeature,
            // filteredRowModel: createFilteredRowModel(),
            // paginatedRowModel: createPaginatedRowModel(),
            // sortedRowModel: createSortedRowModel(),
            // filterFns: { includesString: filterFn_includesString },
            // sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
        }),
        state: {
            sorting,
            pagination: {
                pageSize: meta?.limit || 10,
                pageIndex: 0
            }
        }
    })


    const previousPage = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('p', meta.page - 1)
        params.set('cursor', meta.last_doc)
        router.push(`${pathname}?${params.toString()}`, { scroll: false, })
    }
    const nextPage = () => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('p', meta.page + 1)
        params.set('cursor', meta.last_doc)
        router.push(`${pathname}?${params.toString()}`, { scroll: false, })
    }

    return (
        <div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <table.FlexRender header={header} />
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {
                        isPending
                            ?
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-32 text-center">
                                        <div className="flex flex-col gap-2">
                                            <Icon icon={'mingcute:loading-3-fill'} className='animate-spin mx-auto size-4' />
                                            <span>تحميل...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            :
                            <TableBody>
                                {table?.getRowModel().rows?.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    <table.FlexRender cell={cell} />
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            لا توجد نتائج.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                    }
                </Table>
            </div>
            <div className="flex items-center gap-4 justify-between">
                <span className="text-muted-foreground text-xs">الصفحة {meta?.page || 0} من {meta?.total_pages || 0}</span>
                <div className="flex items-center justify-end space-x-2 py-4">
                    <BaseButton
                        variant="outline"
                        size="sm"
                        title={'السابق'}
                        onClick={previousPage}
                        disabled={meta?.page <= 1 || isPending}
                    />
                    <BaseButton
                        variant="outline"
                        size="sm"
                        title={'التالي'}
                        onClick={nextPage}
                        disabled={meta?.page >= meta?.total_pages || isPending}
                    />
                </div>
            </div>
        </div>
    )
}