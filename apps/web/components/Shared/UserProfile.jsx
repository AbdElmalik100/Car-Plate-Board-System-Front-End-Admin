'use client'
import { useLogout, useMe } from '@/hooks/useAuth'
import { formatAvatarFallbackText } from '@/utils';
import { Icon } from '@iconify/react';
import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@workspace/ui/components/dropdown-menu';

const UserProfile = () => {
    const { data: user } = useMe()
    const { mutate } = useLogout()
    
    return (
        user &&
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src={user.photoURL} />
                    <AvatarFallback>{formatAvatarFallbackText(user.displayname || user.email)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent dir={'rtl'} align='end' className='w-full'>
                <DropdownMenuGroup>
                    <div className='flex items-center gap-2 p-2'>
                        <Avatar>
                            <AvatarImage src={user.photoURL} />
                            <AvatarFallback>{formatAvatarFallbackText(user.displayname || user.email)}</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col text-xs'>
                            <span>{user.displayname || 'الاسم'}</span>
                            <span className='text-muted-foreground'>{user.email}</span>
                        </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>حسابي</DropdownMenuLabel>
                    <DropdownMenuItem>
                        <Icon icon={'boxicons:user'} />
                        <span>الملف الشخصي</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem variant='destructive' onSelect={e => mutate()}>
                        <Icon icon={'heroicons-outline:logout'} />
                        <span>تسجيل الخروج</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserProfile