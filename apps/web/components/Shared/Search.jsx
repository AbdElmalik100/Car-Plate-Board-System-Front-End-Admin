import { Icon } from '@iconify/react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebounce } from '@uidotdev/usehooks'


const Search = ({ placeholder = 'Search...', results = 0, className, isPending, isLocal = false, value, onInput }) => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [searchInput, setSearchInput] = useState(searchParams.get('s') || '')
    const debouncedSearch = useDebounce(searchInput, 500)


    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (debouncedSearch) {
            params.set('s', debouncedSearch)
            params.delete('p')
        } else {
            params.delete('s')
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false, })
    }, [debouncedSearch, router])
    return (
        <div className={className}>
            <InputGroup>
                <InputGroupInput
                    className="w-full"
                    placeholder={placeholder}
                    name={'search'}
                    value={!isLocal ? searchInput : value}
                    onInput={!isLocal ? e => setSearchInput(e.target.value) : onInput}
                />
                <InputGroupAddon>
                    <Icon icon={'iconamoon:search-light'} className="size-4" />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                    {
                        isPending
                            ? <Icon icon={'mingcute:loading-3-fill'} className='animate-spin' />
                            : <>{results} نتائج</>
                    }
                </InputGroupAddon>
            </InputGroup>
        </div>
    )
}

export default Search