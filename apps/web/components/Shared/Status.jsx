import { Icon } from '@iconify/react'
import { Badge } from '@workspace/ui/components/badge'

const Status = ({ status }) => {
    switch (status) {
        case 'approved':
            return (
                <Badge className='bg-green-100 border-green-600 text-green-600 capitalize'>
                    <Icon icon={'material-symbols:check-rounded'} />
                    موافق عليه
                </Badge>
            )
        case 'pending':
            return (
                <Badge className='bg-yellow-100 border-yellow-600 text-yellow-600 capitalize'>
                    <Icon icon={'akar-icons:clock'} />
                    منتظر الموافقة
                </Badge>
            )
        case 'rejected':
            return (
                <Badge className='bg-red-100 border-red-600 text-red-600 capitalize'>
                    <Icon icon={'meteor-icons:xmark'} />
                    مرفوض
                </Badge>
            )
        default:
            return (
                <Badge className='bg-neutral-100 border-neutral-600 text-neutral-600 capitalize'>
                    {status}
                </Badge>
            )
    }
}

export default Status