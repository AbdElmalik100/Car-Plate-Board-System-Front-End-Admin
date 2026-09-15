"use client"
import BaseButton from "@/components/Shared/BaseButton"
import { Icon } from "@iconify/react"
import { createColumnHelper } from "@tanstack/react-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu'
import { Checkbox } from '@workspace/ui/components/checkbox'
import DeleteDialog from "@/components/Shared/DeleteDialog"
import SelectedRows from "@/components/Shared/SelectedRows"
import { formatDate } from "@/utils"
import RepresentativeForm from "./RepresentativeForm"
import { useDeleteRepresentative, useDeleteRepresentatives } from "@/hooks/useRepresentatives"
import { useState } from "react"

const columnHelper = createColumnHelper()

export const Columns = columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => {
            const { mutate, isPending } = useDeleteRepresentatives()
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
                            title={'مندوب'}
                            description={"هل انت متأكد من حذف هذا العدد من المناديب؟, سيتم حذفهم من قاعده البيانات و لا يمكن استراجعهم"}
                            isPending={isPending}
                            handleDeleteAll={(setOpen) => mutate(table.getSelectedRowModel().rows.map(row => row.original.id), {
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
    columnHelper.accessor("name", {
        header: "الاسم",
    }),

    columnHelper.accessor("email", {
        header: "البريد الالكتروني",
    }),

    columnHelper.accessor("phone", {
        header: "رقم الهاتف",
    }),

    columnHelper.accessor("address", {
        header: "العنوان",
    }),

    columnHelper.accessor("code", {
        header: "الكود",
    }),
    columnHelper.accessor("created_at", {
        header: "تاريخ الانشاء",
        cell: ({ getValue }) => (formatDate(getValue()) || '-')
    }),

    columnHelper.display({
        id: "actions",
        cell: ({ row }) => {
            const [openMenu, setOpenMenu] = useState(false)
            const representative = row.original
            const { mutate, isPending } = useDeleteRepresentative()
            return (
                <div className="text-end">
                    <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
                        <DropdownMenuTrigger asChild>
                            <BaseButton
                                icon={'boxicons:dots-horizontal-rounded'}
                                variant="ghost"
                                size={'icon'}
                            />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" dir={'rtl'}>
                            <DropdownMenuLabel>الاجراءات</DropdownMenuLabel>
                            <RepresentativeForm representative={representative} isEdit={true} setOpenMenu={setOpenMenu}>
                                <DropdownMenuItem
                                    onSelect={e => e.preventDefault()}
                                >
                                    <Icon icon={'bitcoin-icons:edit-filled'} />
                                    <span>تعديل</span>
                                </DropdownMenuItem>
                            </RepresentativeForm>
                            <DropdownMenuSeparator />
                            <DeleteDialog
                                title="حذف مندوب"
                                description="هل انت متأكد من حذف هذا المندوب, سيتم حذفه من قاعدة البيانات و لا يمكن استرجاعه"
                                onConfirm={(setOpen) => {
                                    mutate(representative.id, {
                                        onSuccess: () => {
                                            setOpen(false)
                                            setOpenMenu(false)
                                        }
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