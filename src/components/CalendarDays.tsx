import { useContext } from "react";
import { DateRangeContext } from "./DateRangePicker";

interface ICalendarDaysProps {
    dateChange: Date,
}

const CalendarDays: React.FC<ICalendarDaysProps> = ({ dateChange }) => {
    // ===========================================================================
    // State & Config
    // ===========================================================================

    const firstDayOfMonth = new Date(dateChange.getFullYear(), dateChange.getMonth(), 1);
    const weekdayOfFirstDay = firstDayOfMonth.getDay();
    const currentDays = [];

    // ===========================================================================
    // Computed
    // ===========================================================================

    const { datePickerState, datePickerDispatch }: any = useContext(DateRangeContext);

    for (let day = 0; day < 42; day++) {
        if (day === 0 && weekdayOfFirstDay === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() - 7);
        } else if (day === 0) {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + (day - weekdayOfFirstDay));
        } else {
            firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
        }

        const calendarDay = {
            date: (new Date(firstDayOfMonth)),
            month: firstDayOfMonth.getMonth(),
            number: firstDayOfMonth.getDate(),
            year: firstDayOfMonth.getFullYear()
        }

        currentDays.push(calendarDay);
    }

    const getDayClass = (day: any) => {
        const { fromDate, toDate, hoveredDate } = datePickerState;
        const dayTime = day.date.getTime();

        if (!fromDate && !toDate) return 'date-hover';
        if (fromDate && !toDate) {
            if (hoveredDate) {
                const hoveredDateTime = hoveredDate.getTime();
                if (fromDate.date.getTime() == dayTime) return 'active';
                if (hoveredDateTime > fromDate.date.getTime() && hoveredDateTime >= dayTime && dayTime >= fromDate.date.getTime()) {
                    return 'in-range'
                }
            } else {
                if (fromDate.date.getTime() < dayTime) return 'date-hover-selected';
                else if (fromDate.date.getTime() == dayTime) return 'active';
            }
        } else if (fromDate && toDate) {
            // skip weekends
            if (day.date.getDay() === 0 || day.date.getDay() === 6) {
                return '';
            }
            if (fromDate.date.getTime() == dayTime || toDate.date.getTime() == dayTime) {
                return 'active';
            }
            if (dayTime == fromDate.date.getTime() || dayTime == toDate.date.getTime() || (dayTime >= fromDate.date.getTime() && dayTime <= toDate.date.getTime())) return 'in-range';
        }
        return '';
    };

    // ===========================================================================
    // Handlers
    // ===========================================================================

    const handleDayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, day: any) => {
        e.preventDefault();
        if (day.date.getDay() == 6 || day.date.getDay() == 0) {
            return;
        }
        datePickerDispatch({
            type: "select_day",
            payload: { 'day': day }
        })
    }

    const handleDayHover = (day: any) => {
        datePickerDispatch({
            type: "set_hovered_date",
            payload: { 'day': day.date }
        })
    };

    const handleDayMouseLeave = () => {
        datePickerDispatch({
            type: "set_hovered_date",
            payload: { 'day': null }
        })
    };

    // ===========================================================================
    // JSX Content
    // ===========================================================================

    return (
        currentDays.reduce((rows: any, day: any, index: number) => {
            if (index % 7 === 0) {
                rows.push([]);
            }
            rows[rows.length - 1].push(day);
            return rows;
        }, []).map((rowDays: any, rowIndex: number) => (
            <tr key={rowIndex}>
                {rowDays.map((day: any, dayIndex: number) => (
                    <td
                        className={`available ${getDayClass(day)}`}
                        onClick={e => handleDayClick(e, day)}
                        onMouseEnter={() => handleDayHover(day)}
                        onMouseLeave={handleDayMouseLeave}
                        key={dayIndex}
                    >
                        {day.number}
                    </td>
                ))}
            </tr>
        ))
    )
}

export default CalendarDays;