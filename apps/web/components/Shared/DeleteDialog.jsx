import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from '@workspace/ui/components/alert-dialog'
import { useState } from 'react'
import BaseButton from './BaseButton'
import { Icon } from '@iconify/react'


const DeleteDialog = ({
    title = 'حذف',
    description = "هل انت متأكيد من انك تريد حذف هذا؟ سيتم حذفه من قاعدة البيانات و لا يمكن استرجاعه",
    onConfirm,
    isPending,
    children
}) => {
    const [open, setOpen] = useState(false)

    const handleConfirm = async (e) => {
        e.preventDefault()
        await onConfirm(setOpen)
    }
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent size='sm'>
                <AlertDialogHeader>
                    <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Icon icon={'basil:trash-solid'} />
                    </AlertDialogMedia>
                    <AlertDialogTitle>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>الغاء</AlertDialogCancel>
                    <AlertDialogAction
                        asChild
                        variant={'destructive'}
                        onClick={handleConfirm}
                    >
                        <BaseButton
                            disabled={isPending}
                            isLoading={isPending}
                            title={'تأكيد الحذف'}
                        />
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialog