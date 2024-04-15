import React, { useEffect, useRef } from "react";

interface CalendarMonthGridProps {
    selectedDay: Date;
    onSelectMonth?: (year: number, month: number) => void;
}

const CalendarMonthGrid: React.FC<CalendarMonthGridProps> = ({
    selectedDay,
    onSelectMonth,
}) => {
    // ===========================================================================
    // State & Config
    // ===========================================================================
    const years = Array.from({ length: 2050 - 1970 + 1 }, (_, i) => 1970 + i); // Generate array of years (1900-3000)
    const selectedYearRef = useRef<HTMLDivElement>(null);

    // ===========================================================================
    // Hooks
    // ===========================================================================

    useEffect(() => {
        if (selectedYearRef.current) {
            selectedYearRef.current.scrollIntoView(); // Move to selected year
        }
    }, [selectedDay]);


    // ===========================================================================
    // Handlers
    // ===========================================================================

    const handleMonthClick = (year: number, month: number) => {
        onSelectMonth?.(year, month);
    };


    // ===========================================================================
    // JSX Content
    // ===========================================================================

    const renderCalendarMonth = (months: number[], year: number) => {
        return months.map((month, index) => (
            <button
                key={`${year}-${index}`} // Use year-month combination for unique key
                className={`calendar-month-button ${selectedDay.getMonth() === index && selectedDay.getFullYear() === year
                    ? "selected"
                    : ""
                    }`}
                onClick={() => handleMonthClick(year, index)}
            >
                {month}
            </button>
        ))
    }

    return (
        <div className="calendar-month-grid">
            <div className="calendar-grid" style={{ overflow: "auto", height: "170px", width: "218px", position: "absolute" }}>
                {years.map((year) => (
                    <div
                        key={year}
                        className={`year-container ${selectedDay.getFullYear() === year ? "selected" : ""}`}
                        ref={selectedDay.getFullYear() === year ? selectedYearRef : undefined}
                    >
                        <h2>{year}</h2>
                        <div className="month-grid">
                            {renderCalendarMonth([1, 2, 3, 4, 5, 6], year)}
                        </div>
                        <div className="month-grid">
                            {renderCalendarMonth([7, 8, 9, 10, 11, 12], year)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CalendarMonthGrid;
