# React Date Range Picker React Typescript

Date range picker component allows you select range of dates

### Prerequisites :

- [node-js](https://github.com/creationix/nvm) v20 LTS or higher

- [npm](https://npmjs.com/)

## Usage

```
const  onDateSelect  = (weekdays:  Array<string>, weekends:  Array<string>) => {
console.log(weekdays, weekends);
// required action
}

<DateRangePicker
dateRanges={[
{ label: "Today", value: 1 },
{ label: "Last 7 days", value: 7 },
]}
format={"yyyy-mm-dd"}
classnames={'range-picker-1'}
onDateSelect={onDateSelect}
/>
```

## Project Setup

```sh

nvm  use

```

```sh

npm  install

```

### Compile and Hot-Reload for Development

```sh

npm  run dev

```
