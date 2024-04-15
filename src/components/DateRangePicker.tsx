import { createContext, useEffect, useReducer, useRef, useState } from "react"
import Calendar from '@/components/Calendar';

interface IDateRange {
    label: string,
    value: number
}

interface IDateRangeProps {
    dateRanges: Array<IDateRange>
    format: any
    classnames: string
    onDateSelect: (selectedWeekdays: Array<string>, selectedWeekends: Array<string>) => void
}

export const DateRangeContext = createContext({});

const DateRangePicker: React.FC<IDateRangeProps> = ({ dateRanges, format, classnames, onDateSelect }) => {
    // ===========================================================================
    // State & Config
    // ===========================================================================
    const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false);
    const dateRangePickerRef = useRef<HTMLDivElement>(null);
    const [selectedWeekdays, setSelectedWeekDays] = useState<Array<string>>([]);
    const [selectedWeekends, setSelectedWeekends] = useState<Array<string>>([]);

    const initialDatePickerState = {
        fromDate: null,
        toDate: null,
        hoveredDate: null as Date | null
    }

    // ===========================================================================
    // Reducer actions
    // ===========================================================================
    const reducer = (state: any, action: any) => {
        switch (action.type) {
            case 'select_day':
                if (state.fromDate && !state.toDate) {
                    return {
                        ...state,
                        toDate: action.payload.day,
                    };
                }
                if (!state.fromDate && !state.toDate) {
                    return {
                        ...state,
                        fromDate: action.payload.day,
                    };
                }
                if (state.fromDate && state.toDate) {
                    return {
                        fromDate: null,
                        toDate: null,
                    };
                }
                break;

            case 'set_hovered_date':
                return {
                    ...state,
                    hoveredDate: action.payload.day,
                };

            case 'select_predefined_range':
                const { dayDifference } = action.payload;
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - dayDifference);

                const updatedFromDate = {
                    year: fromDate.getFullYear(),
                    month: fromDate.getMonth(),
                    date: fromDate
                };

                const toDate = {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth(),
                    date: new Date(),
                };

                return {
                    ...state,
                    fromDate: updatedFromDate,
                    toDate: toDate,
                };
            case 'reset':
                return {
                    fromDate: null,
                    toDate: null,
                    hoveredDate: null
                }

            default:
                return state;
        }
    };


    // ===========================================================================
    // Hooks
    // ===========================================================================

    const [datePickerState, dispatch] = useReducer(reducer, initialDatePickerState);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dateRangePickerRef.current && !dateRangePickerRef.current.contains(event.target as Node)) {
                setIsDateRangePickerOpen(false);
                dispatch({
                    type: 'reset'
                })
            }
        };

        // Add event listener on mount
        document.addEventListener('mousedown', handleClickOutside);

        // Remove event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDateRangePickerOpen]);


    // ===========================================================================
    // Handlers
    // ===========================================================================

    const handleDatePickerClick = () => {
        setIsDateRangePickerOpen(true);
    }

    const handleSelectPredefinedRange = (dayDifference: number) => {
        dispatch({
            type: "select_predefined_range",
            payload: { 'dayDifference': dayDifference }
        })
    }

    const canSubmitDate = () => {
        const { fromDate, toDate } = datePickerState;
        return fromDate && toDate
    }

    const handleDatePickerSubmit = () => {
        const { fromDate, toDate } = datePickerState;
        const earlierDate = fromDate <= toDate ? fromDate : toDate;
        const laterDate = earlierDate === fromDate ? toDate : fromDate;
        const weekends = [];

        const current = new Date(earlierDate.date);
        while (current <= laterDate.date) {
            const dayOfWeek = current.getDay(); // 0 (Sunday) - 6 (Saturday)

            // Push weekends to selectedWeekends
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                weekends.push(convertDate(new Date(current), format));
            }

            // Move to the next day
            current.setDate(current.getDate() + 1);
        }
        const selectedFormattedWeekDayRange = [convertDate(earlierDate.date, format), convertDate(laterDate.date, format)];
        setSelectedWeekDays(selectedFormattedWeekDayRange);
        setSelectedWeekends(weekends);
        onDateSelect(selectedWeekdays as Array<string>, selectedWeekends as Array<string>);
        setIsDateRangePickerOpen(false);
    }

    const handleRemoveDate = () => {
        setSelectedWeekDays([]);
        setSelectedWeekends([]);
    }

    // ===========================================================================
    // JSX Content
    // ===========================================================================

    const renderPredefinedRanges = (
        <>
            {
                dateRanges.map((range, index) => {
                    return <button className="btn btn-sm btn-default" onClick={() => handleSelectPredefinedRange(range.value)} key={index}>{range.label}</button>
                })
            }
        </>
    )

    const renderDatePickerActions = (
        <button className="btn btn-sm btn-default" disabled={!canSubmitDate()} onClick={handleDatePickerSubmit}>OK</button>
    )

    const convertDate = (date: Date, format: string): string => {
        const formatMap = {
            'yyyy': date.getFullYear().toString().padStart(4, '0'),
            'mm': (date.getMonth() + 1).toString().padStart(2, '0'),
            'dd': date.getDate().toString().padStart(2, '0'),
        } as any;

        const formattedDate = [];
        for (const char of format.split('-')) {
            if (char in formatMap) {
                formattedDate.push(formatMap[char]);
            } else {
                formattedDate.push(char);
            }
        }
        return formattedDate.join('-');
    }

    const renderDatePickerTitle = () => {
        if (selectedWeekdays && selectedWeekdays.length === 2) {
            return <span>{selectedWeekdays[0]} -  {selectedWeekdays[1]} <i onClick={handleRemoveDate} className="fa fa-close"></i></span>;
        } else {
            return <span>
                {format} ~ {format}
                <i className="fa fa-calendar"></i>
            </span>;
        }
    };

    return (
        <DateRangeContext.Provider value={{ datePickerState: datePickerState, datePickerDispatch: dispatch }}>
            <div ref={dateRangePickerRef}>
                <div className="date-picker-select" onClick={handleDatePickerClick}>{renderDatePickerTitle()}</div>
                {isDateRangePickerOpen && (
                    <>
                        <div className={`${classnames} daterangepicker ltr show-ranges opensright show-calendar`} style={{ display: 'block' }}>
                            <Calendar classnames={'drp-calendar left'} />
                            <Calendar isSecondaryCalendar={true} classnames={'drp-calendar right'} />
                            <div className="drp-buttons">
                                {renderPredefinedRanges}
                                {renderDatePickerActions}
                            </div>
                        </div>
                    </>
                )
                }
            </div >
        </DateRangeContext.Provider >
    )
}

export default DateRangePicker;