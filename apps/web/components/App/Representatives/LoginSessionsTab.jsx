import { DataTable } from "@/components/Shared/DataTable"
import EmptyState from "@/components/Shared/EmptyState"
import { TabsContent } from "@workspace/ui/components/tabs"
import Search from "@/components/Shared/Search"
import { useMemo } from "react"
import { useGetLoginSessions } from "@/hooks/useRepresentatives"
import { useSearchParams } from "next/navigation"
import Heading from "@/components/Shared/Heading"
import { Columns } from "./LoginSessionsColumns"

const LoginSessionsTab = () => {
  const searchParams = useSearchParams()

  const { data, isPending } = useGetLoginSessions({
    cursor: searchParams.get("cursor"),
    page: searchParams.get("p"),
    search: searchParams.get("s"),
  })

  const loginSessions = useMemo(() => data?.login_sessions, [data])
  const meta = useMemo(() => data?.meta, [data])

  const showInitialEmpty = !isPending && !(!!searchParams) && meta?.total === 0
  return (
    <TabsContent value="login-sessions">
      <Heading title={'جلسات تسجيل الدخول'}>
        <div className='flex items-center gap-2'>
          {/* <RepresentativeForm /> */}
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
            ? <DataTable columns={Columns} data={loginSessions ?? []} isPending={isPending} meta={meta} />
            : <EmptyState
              title="لا يوجد جلسات تسجيل دخول"
              description="لم تتم إضافة أي مناديب حتى الآن. قم بإضافة مندوب للبدء."
              icon={'bitcoin-icons:key-filled'}
            />
        }
      </div>
    </TabsContent>
  )
}

export default LoginSessionsTab