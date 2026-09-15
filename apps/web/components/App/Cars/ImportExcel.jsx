import BaseButton from '@/components/Shared/BaseButton'
import { useImportExcel } from '@/hooks/useCars'
import queryClient from '@/lib/react-query'
import { Input } from '@workspace/ui/components/input'
import { useRef } from 'react'
import { toast } from 'sonner'

const ImportExcel = () => {
    const { mutate, isPending } = useImportExcel()
    const fileInputRef = useRef(null)

    const handleImport = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        const toastId = toast.loading('جاري استيراد السيارات... 0%')
        mutate(
            {
                file,
                onProgress: (progress) => {                    
                    toast.loading(
                        `جاري استيراد السيارات... ${progress}%`,
                        {
                            id: toastId,
                        }
                    )
                },
            },
            {
                onSuccess: ({ total, added, updated }) => {
                    toast.success(
                        `تم استيراد ${total} سيارة بنجاح`,
                        {
                            id: toastId,
                            description: `تمت إضافة ${added} سيارة وتحديث ${updated} سيارة`,
                        }
                    )
                    queryClient.invalidateQueries({queryKey: ['get cars']})
                },
                onError: (error) => {
                    toast.error(
                        'حدث خطأ أثناء استيراد ملف Excel',
                        {
                            id: toastId,
                            description: error?.message || 'حدث خطأ غير متوقع',
                        }
                    )
                },
            }
        )

        // Allow selecting the same file again
        event.target.value = ''
    }

    return (
        <>
            <BaseButton
                icon={'fa7-solid:file-excel'}
                variant={'outline'}
                title={'Import Excel'}
                onClick={() =>
                    fileInputRef.current?.click()
                }
                disabled={isPending}
            />

            <Input
                ref={fileInputRef}
                id='excel-upload'
                className='hidden'
                type='file'
                accept='.xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                onChange={handleImport}
            />
        </>
    )
}

export default ImportExcel