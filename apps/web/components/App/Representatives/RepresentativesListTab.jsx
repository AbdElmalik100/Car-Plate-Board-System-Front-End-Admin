import { DataTable } from "@/components/Shared/DataTable"
import EmptyState from "@/components/Shared/EmptyState"
import RepresentativeForm from "./RepresentativeForm"
import { TabsContent } from "@workspace/ui/components/tabs"
import Search from "@/components/Shared/Search"
import { useMemo } from "react"
import { useGetRepresentatives } from "@/hooks/useRepresentatives"
import { useSearchParams } from "next/navigation"
import { Columns } from "./RepresentativesListColumns"
import Heading from "@/components/Shared/Heading"

const RepresentativesListTab = () => {
  const searchParams = useSearchParams()

  const { data, isPending } = useGetRepresentatives({
    cursor: searchParams.get("cursor"),
    page: searchParams.get("p"),
    search: searchParams.get("s"),
  })

  const representatives = useMemo(() => data?.representatives, [data])
  const meta = useMemo(() => data?.meta, [data])

  const showInitialEmpty = !isPending && !(!!searchParams) && meta?.total === 0
  return (
    <TabsContent value="representatives-list">
      <Heading title={'المناديب'}>
        <div className='flex items-center gap-2'>
          <RepresentativeForm />
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
            ? <DataTable columns={Columns} data={representatives ?? []} isPending={isPending} meta={meta} />
            : <EmptyState
              title="لا يوجد مناديب"
              description="لم تتم إضافة أي مناديب حتى الآن. قم بإضافة مندوب للبدء."
              icon={'gridicons:multiple-users'}
            >
              <RepresentativeForm />
            </EmptyState>
        }
      </div>
    </TabsContent>
  )
}

export default RepresentativesListTab