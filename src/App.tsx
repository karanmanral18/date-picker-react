import "./App.css";
import DateRangePicker from "./components/DateRangePicker";

export const App: React.FC = () => {

  const onDateSelect = (weekdays: Array<string>, weekends: Array<string>) => {
    console.log(weekdays, weekends);
    // required action
  }

  return (
    <>
      <DateRangePicker
        dateRanges={[
          { label: "Today", value: 1 },
          { label: "Last 7 days", value: 7 },
        ]}
        format={"yyyy-mm-dd"}
        classnames={'range-picker-1'}
        onDateSelect={onDateSelect}
      />

      <DateRangePicker
        dateRanges={[
          { label: "Last Month", value: 30 },
          { label: "2 days", value: 2 },
        ]}
        format={"mm-dd-yyyy"}
        classnames={'range-picker-2'}
        onDateSelect={onDateSelect}
      />
    </>
  );
};

export default App;
