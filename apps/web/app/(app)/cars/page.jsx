'use client'
import CarForm from '@/components/App/Cars/CarForm';
import { Columns } from '@/components/App/Cars/Columns';
import Filters from '@/components/App/Cars/Filters';
import ImportExcel from '@/components/App/Cars/ImportExcel';
import { DataTable } from '@/components/Shared/DataTable'
import EmptyState from '@/components/Shared/EmptyState';
import Heading from '@/components/Shared/Heading'
import Search from '@/components/Shared/Search';
import { useGetCars } from '@/hooks/useCars';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

const Cars = () => {
    const searchParams = useSearchParams()
    const { data, isPending } = useGetCars({
        cursor: searchParams.get("cursor"),
        page: searchParams.get("p"),
        search: searchParams.get("s"),
        from_date: searchParams.get('from_date'),
        to_date: searchParams.get('to_date')
    })

    const cars = useMemo(() => data?.cars, [data])
    const meta = useMemo(() => data?.meta, [data])
    
    const showInitialEmpty = !isPending && !(!!searchParams) && meta?.total === 0
    return (
        <div className='p-6 min-h-screen'>
            <Heading title={'السيارات'}>
                <div className='flex items-center gap-2'>
                    <ImportExcel />
                    <CarForm />
                </div>
            </Heading>
            <div className='mt-8 flex flex-col gap-4 h-screen '>
                <div className='toolbar flex items-center gap-4 justify-between'>
                    <Search
                        className={'w-md'}
                        placeholder='بحث...'
                        results={meta?.total}
                    />
                    <div>
                        {/* <span>Sort</span> */}
                        {/* <Filters isPending={isPending} /> */}
                    </div>
                </div>
                {
                    !showInitialEmpty
                        ? <DataTable columns={Columns} data={cars ?? []} isPending={isPending} meta={meta} />
                        : <EmptyState
                            title="لا توجد سيارات"
                            description="لم تتم إضافة أي سيارات حتى الآن. قم بإضافة سيارة للبدء."
                            icon={'bi:car-front-fill'}
                        >
                            <CarForm />
                        </EmptyState>
                }
            </div>
        </div>
    )
}

export default Cars