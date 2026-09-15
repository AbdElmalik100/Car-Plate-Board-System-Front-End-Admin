"use client"
import BaseButton from "@/components/Shared/BaseButton"
import { Icon } from "@iconify/react"
import { createColumnHelper } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu'
import { Checkbox } from '@workspace/ui/components/checkbox'
import CarForm from "./CarForm"
import DeleteDialog from "@/components/Shared/DeleteDialog"
import { useDeleteCar, useDeleteCars } from "@/hooks/useCars"
import SelectedRows from "@/components/Shared/SelectedRows"
import { formatDate } from "@/utils"

const columnHelper = createColumnHelper()

export const Columns = columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => {
            const { mutate, isPending } = useDeleteCars()
            return (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                    {
                        <SelectedRows
                            title={'سيارة'}
                            description={"هل انت متأكد من حذف هذا العدد من السيارات؟, سيتم حذفهم من قاعده البيانات و لا يمكن استراجعهم"}
                            isPending={isPending}
                            handleDeleteAll={(setOpen) => mutate(table.getSelectedRowModel().rows.map(row => row.original.plate_key), {
                                onSuccess: () => {
                                    table.resetRowSelection()
                                    setOpen(false)
                                }
                            })}
                            close={() => table.resetRowSelection()}
                            totalSelected={table.getSelectedRowModel().rows.length}
                        />
                    }
                </div>
            )
        },
        cell: ({ row }) => (
            <div className="flex items-center justify-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    }),
    columnHelper.accessor("plate", {
        header: "اللوحة",
    }),

    columnHelper.accessor("car_type", {
        header: "النوع",
    }),

    columnHelper.accessor("bank", {
        header: "البنك",
    }),

    columnHelper.accessor("chassis_number", {
        header: "الشاص",
    }),

    columnHelper.accessor("record_date", {
        header: "تاريخ المحفظة",
        cell: ({ getValue }) =>(<span>{formatDate(getValue())}</span>)
    }),

    columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
            const car = row.original
            const { mutate, isPending } = useDeleteCar()
            return (
                <div className="text-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <BaseButton
                                icon={'boxicons:dots-horizontal-rounded'}
                                variant="ghost"
                                size={'icon'}
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" dir={'rtl'}>
                            <DropdownMenuLabel>الاجراءات</DropdownMenuLabel>
                            <CarForm car={car} isEdit={true}>
                                <DropdownMenuItem
                                    onSelect={e => e.preventDefault()}
                                >
                                    <Icon icon={'bitcoin-icons:edit-filled'} />
                                    <span>تعديل</span>
                                </DropdownMenuItem>
                            </CarForm>
                            <DropdownMenuSeparator />
                            <DeleteDialog
                                title="حذف سيارة"
                                description="هل انت متأكد من حذف هذه السيارة, سيتم حذفها من قاعدة البيانات و لا يمكن استرجاعها"
                                onConfirm={(setOpen) => {
                                    mutate(car.plate_key, {
                                        onSuccess: () => setOpen(false)
                                    })
                                }}
                                isPending={isPending}
                            >
                                <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={e => e.preventDefault()}
                                >
                                    <Icon icon={'basil:trash-solid'} />
                                    <span>حذف</span>
                                </DropdownMenuItem>
                            </DeleteDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    }),
])