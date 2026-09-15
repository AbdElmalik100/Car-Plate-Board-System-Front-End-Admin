import { Icon } from '@iconify/react'
import { Button } from '@workspace/ui/components/button'
import { Calendar } from '@workspace/ui/components/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover'
import { format } from 'date-fns'


const DatePicker = ({ date, setDate, dataError }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    data-error={dataError}
                    variant="outline"
                    data-empty={!date}
                    className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                    <Icon icon={'akar-icons:calendar'} />
                    {date ? format(date, "dd/MM/yyyy") : <span className='text-muted-foreground'>اختر تاريخ</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                />
            </PopoverContent>
        </Popover>
    )
}

export default DatePicker