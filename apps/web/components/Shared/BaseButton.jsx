import { Button } from '@workspace/ui/components/button'
import Link from 'next/link'
import { Icon } from "@iconify/react";


const BaseButton = ({ title, icon, isLoading, className, iconClassName, href, target, download, ...props }) => {
    return (
        <Button
            {...props}
            className={`data-[variant=default]:hover:bg-primary/90 ${className}`}
        >
            {
                isLoading &&
                <svg className='animate-[spin_0.4s_linear_infinite] transition-transform duration-75! absolute' xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" opacity=".1" />
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M12 3a8.96 8.96 0 0 0-6.225 2.5" />
                </svg>
            }
            {/* {isLoading && <svg className='animate-spin absolute' xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.2 0l136 135.8a32 32 0 0 1-45.3 45.3L195.2 240.4a32 32 0 0 1 0-45.2m452.5 452.5a32 32 0 0 1 45.3 0l135.8 135.9a32 32 0 0 1-45.2 45.2L647.7 693a32 32 0 0 1 0-45.3m181.1-452.4a32 32 0 0 1 0 45.1L693 376.4a32 32 0 0 1-45.3-45.3l135.9-135.8a32 32 0 0 1 45.2 0M376.3 647.7a32 32 0 0 1 0 45.3L240.4 828.8a32 32 0 0 1-45.2-45.2L331 647.7a32 32 0 0 1 45.3 0" /></svg>} */}
            {
                href
                    ?
                    <Link href={href} target={target} download={download} className={`flex flex-1 items-center gap-2 justify-center ${isLoading ? 'invisible' : 'visible'}`}>
                        {icon && <Icon icon={icon} className={iconClassName} />}
                        {title && <span >{title}</span>}
                    </Link>
                    :
                    <div className={`flex items-center gap-2 justify-center ${isLoading ? 'invisible' : 'visible'}`}>
                        {icon && <Icon icon={icon} className={iconClassName} />}
                        {title && <span >{title}</span>}
                    </div>
            }
        </Button>
    )
}

export default BaseButton

