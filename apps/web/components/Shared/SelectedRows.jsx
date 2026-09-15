import BaseButton from "./BaseButton"
import DeleteDialog from "./DeleteDialog"

const SelectedRows = ({ totalSelected, handleDeleteAll, isPending, close, title, description }) => {
    return (
        <div className={`fixed flex bg-background items-center gap-4 z-50 left-1/2 -translate-x-1/2 border rounded-full p-4 w-96 transition-all ease-out ${totalSelected > 0 ? 'bottom-5' : '-bottom-20'}`}>
            <div className="flex items-center gap-4">
                <BaseButton
                    icon={'at-icons:cross'}
                    variant={'ghost'}
                    size={'icon'}
                    disabled={isPending}
                    onClick={close}
                />
                <span>
                    {totalSelected} اختيار
                </span>
            </div>
            <DeleteDialog
                title={`حذف ${totalSelected} ${title}`}
                description={description}
                onConfirm={(setOpen) => handleDeleteAll(setOpen)}
                isPending={isPending}
            >
                <BaseButton
                    className={'ms-auto'}
                    variant={'destructive'}
                    size={'icon'}
                    icon={'basil:trash-solid'}
                />
            </DeleteDialog>
        </div>
    )
}

export default SelectedRows