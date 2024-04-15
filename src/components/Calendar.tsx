import { useEffect, useState } from "react"
import CalendarDays from "@/components/CalendarDays";
import { months, weeks } from "./_config";
import CalendarMonth from "@/components/CalendarMonth";

interface ICalendarProps {
    isSecondaryCalendar?: boolean
    classnames: string
}

const Calendar: React.FC<ICalendarProps> = ({ isSecondaryCalendar, classnames }) => {
    // ===========================================================================
    // State & Config
    // ===========================================================================
    const [date, setDate] = useState(new Date());
    const [dateChange, setDateChange] = useState(date);
    const [showMonths, setShowMonths] = useState(false);

    // ===========================================================================
    // Hooks
    // ===========================================================================
    useEffect(() => {
        setDate(new Date());
        if (isSecondaryCalendar) {
            setDateChange(new Date(dateChange.getFullYear(), dateChange.getMonth() + 1))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    // ===========================================================================
    // Handlers
    // ===========================================================================
    const nextMonth = () => {
        const newDate = new Date(dateChange.getFullYear(), dateChange.getMonth() + 1, 1);
        setDateChange(newDate);
    };

    const prevMonth = () => {
        const newDate = new Date(dateChange.getFullYear(), dateChange.getMonth() - 1, 1);
        setDateChange(newDate);
    };

    const onSelectMonth = (year: number, monthIndex: number) => {
        const newDate = new Date(year, monthIndex, 1)
        setDateChange(newDate);
        setShowMonths(false);
    }

    // ===========================================================================
    // JSX Content
    // ===========================================================================
    const renderCalendarTitle = (
        <>
            <th className="prev available" onClick={() => prevMonth()}><span></span></th>
            <th colSpan={5} className="month" onClick={() => setShowMonths(true)}>{months[dateChange.getMonth()]},{dateChange.getFullYear()}</th>
            <th className="next available" onClick={() => nextMonth()}><span></span></th>
        </>
    )

    const renderWeekNames = (
        <>
            {
                weeks.map((weekday, index) => {
                    return <th key={index}>{weekday}</th>
                })
            }
        </>
    )

    const renderCalendarContent = (
        showMonths ? <CalendarMonth selectedDay={new Date()} onSelectMonth={onSelectMonth} /> :
            <tbody><CalendarDays dateChange={dateChange} /></tbody>
    )

    return (
        <div className={classnames}>
            <div className="calendar-table">
                <table className="table-condensed">
                    <thead>
                        <tr>
                            {renderCalendarTitle}
                        </tr>
                        <tr>
                            {renderWeekNames}
                        </tr>
                    </thead>
                    {renderCalendarContent}
                </table>
            </div>
        </div>
    )
}

export default Calendar