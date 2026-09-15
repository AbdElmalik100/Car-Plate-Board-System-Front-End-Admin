"use client"
import BaseButton from "@/components/Shared/BaseButton"
import { createColumnHelper } from "@tanstack/react-table"
import { Checkbox } from '@workspace/ui/components/checkbox'
import { formatDate } from "@/utils"
import { useDeleteRepresentative, useUpdateLoginSessions } from "@/hooks/useRepresentatives"
import { useState } from "react"
import Status from "@/components/Shared/Status"

const columnHelper = createColumnHelper()

export const Columns = columnHelper.columns([
    columnHelper.display({
        id: "select",
        header: ({ table }) => {
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
    columnHelper.accessor("rep_name", {
        header: "اسم المندوب",
    }),

    columnHelper.accessor("device_label", {
        header: "اسم الجهاز",
    }),
    // columnHelper.accessor("code", {
    //     header: "الكود",
    // }),
    columnHelper.accessor("status", {
        header: "حالة الطلب",
        cell: ({ getValue }) => (<Status status={getValue()} />)
    }),

    columnHelper.accessor("requested_at", {
        header: "تاريخ الطلب",
        cell: ({ getValue }) => (formatDate(getValue()) || '-')
    }),

    columnHelper.display({
        id: "actions",
        header: "الاجراءات",
        cell: ({ row }) => {
            const [status, setStatus] = useState('approved')
            const loginSession = row.original
            const { mutate, isPending } = useUpdateLoginSessions()
            
            const handleUpdateStatus = (status) => {
                setStatus(status)
                mutate({...loginSession, status})
            }
            if (loginSession.status === 'pending') {
                return (
                    <div className="text-end flex items-center gap-2">
                        <BaseButton
                            variant={'success'}
                            title={'موافقة'}
                            isLoading={isPending && status === 'approved'}
                            disabled={isPending}
                            onClick={() => handleUpdateStatus('approved')}
                            />
                        <BaseButton
                            variant={'destructive'}
                            title={'رفض'}
                            isLoading={isPending && status === 'rejected'}
                            disabled={isPending}
                            onClick={() => handleUpdateStatus('rejected')}
                        />
                    </div>
                )
            }
        },
    }),
])